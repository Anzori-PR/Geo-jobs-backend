const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { search } = require('../routes/vacancies');

module.exports = {
    Register: async (req, res) => {
        const { name, email, password, role, companyInfo = {} } = req.body;
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

            const token = jwt.sign({ id: newUser._id, newUser: newUser.role }, process.env.JWT_TOKEN, { expiresIn: '1h' });

            res.status(201).json({ 
                message: 'Registration successful',
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    companyInfo: newUser.role === 'company' ? newUser.companyInfo : {} // Only include company info if the user is a company
                } 

            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to register user' });
        }
    },
    Login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Find the user by email
            const user = await UserModel.findOne({ email });

            // Check user exists
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // For Admin
            if (user.email === 'admin9595' && user.password === 'admin9595') {
                return res.status(201).json({
                    message: 'Login successful',
                    role: 'admin'
                });
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
    GetAllUser: async (req, res) => {
        try {
            const users = await UserModel.find({});

            const filteredUsers = users.filter(user => user.role !== 'admin');

            res.json(filteredUsers.map(user => ({
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })));
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve companies' });
        }
    },
    deleteUser: async (req, res) => {
        UserModel.findByIdAndDelete(req.params.id)
            .then(() => res.json('User deleted.'))
            .catch(err => res.status(400).json('Error: ' + err));
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
    searchUser: (req, res) => {
        const { name } = req.query;

        const filter = {role: { $ne: "admin" }};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        UserModel.find(filter)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ error: 'Failed to search users' });
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
        const file = req.file; // The uploaded file from Cloudinary
    
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            if (user.role !== 'company') {
                return res.status(403).json({ error: 'Only company users can add company info' });
            }
    
            // Parse companyInfo if it's a string (might come as JSON string from FormData)
            const parsedCompanyInfo = typeof companyInfo === 'string' ? JSON.parse(companyInfo) : companyInfo;
    
            // Update company info with Cloudinary image URL
            user.companyInfo = {
                ...parsedCompanyInfo,
                _filename : file ? file.path : user.companyInfo._filename // Save Cloudinary URL
            };
    
            await user.save();
    
            res.status(201).json({
                message: 'Company info updated successfully',
                companyInfo: user.companyInfo
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add company info', details: error.message });
        }
    }
    
}
