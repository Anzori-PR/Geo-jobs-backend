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
                role
            });

            await newUser.save();

            if (role === 'company') {
                newUser.companyInfo = companyInfo;
            }

            const token = jwt.sign({ id: newUser._id, role: newUser.role }, 'your_jwt_secret', { expiresIn: '1h' });

            res.status(201).json({
                message: 'Registration successful',
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    companyInfo: newUser.role === 'company' ? user.companyInfo : null // Only include company info if the user is a company
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
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

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
