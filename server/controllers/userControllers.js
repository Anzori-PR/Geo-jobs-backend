const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    Register: async (req, res) => {
        const { name, email, password, role, companyInfo } = req.body;
        try {
            // Check if the user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                role,
                companyInfo: role === 'company' ? companyInfo : undefined
            });

            await newUser.save();


            res.status(201).json({message: 'Registration successful'});

        } catch (error) {
            res.status(500).json({ error: 'Failed to register user' });
        }
    },
    Login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_TOKEN, { expiresIn: '1h' });

            // Send response with user info and token
            res.status(201).json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    companyInfo: user.role === 'company' ? user.companyInfo : null // Only include company info if the user is a company
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to login', details: error.message });
        }
    },
    GetAllCompany: async (req, res) => {
        try {
            const companies = await UserModel.find({ role: 'company' }, 'companyInfo');

            res.json(companies.map(company => ({
                userId: company._id,
                companyInfo: company.companyInfo
            })));
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve companies' });
        }
    },
    searchCompany: (req, res) => {
        const { companyName, companyCategory, address } = req.query;

        const filter = {};

        if (companyName) {
            filter['companyInfo.companyName'] = { $regex: companyName, $options: 'i' };
        }
        if (companyCategory) {
            filter['companyInfo.companyCategory'] = companyCategory;
        }
        if (address) {
            filter['companyInfo.address'] = address;
        }

        UserModel.find(filter)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ error: 'Failed to search vacancies' });
            });
    },
    GetCompanyById: async (req, res) => {
        const companyId = req.params.id;

        try {
            const company = await UserModel.findById(companyId);
            res.json(company);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve company' });  
        }
    },
    UpdateCompany: async (req, res) => {
        const { userId, companyInfo } = req.body;

        // Destructure companyInfo
        const { companyName, companyCategory, email, phone, description, address, website, socialMedia, _filename } = companyInfo;

        try {
            // Find the user by ID
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Ensure the user is a company
            if (user.role !== 'company') {
                return res.status(403).json({ error: 'Only company users can add company info' });
            }

            // Add company info
            user.companyInfo = {
                companyName,
                companyCategory,
                email,
                phone,
                description,
                address,
                website,
                socialMedia,
                _filename
            };

            await user.save();

            res.status(201).json({
                message: 'Company info added successfully',
                companyInfo: user.companyInfo
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add company info', details: error.message });
        }
    }
}
