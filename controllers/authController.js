const Owner = require("../models/Owner");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const ownerSignup = (req, res) => {
    res.render("auth/signup.ejs", { error: null, values: {} });
};

const signupUser = async (req, res) => {
    const {
        username,
        email,
        fullName,
        phone,
        garageName,
        password,
        confirmPassword,
        gender,
        level
    } = req.body || {};

    const renderSignupError = (message) => {
        res.status(400).render("auth/signup.ejs", {
            error: message,
            values: { username, email, fullName, phone, garageName, gender, level }
        });
    };

    if (![username, email, password, confirmPassword]
        .every((value) => typeof value === "string" && value.trim())) {
        return renderSignupError("Please complete all required fields.");
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return renderSignupError("Please enter a valid email address.");
    }

    if (normalizedUsername.length < 2 || normalizedUsername.length > 50) {
        return renderSignupError("Username must be between 2 and 50 characters.");
    }

    if (password.length < 6) {
        return renderSignupError("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
        return renderSignupError("Passwords do not match.");
    }

    if (!["male", "female"].includes(gender)) {
        return renderSignupError("Please choose male or female.");
    }

    try {
        const existingUser = await User.findOne({
            $or: [
                { username: normalizedUsername },
                { email: normalizedEmail }
            ]
        });
        if (existingUser) {
            const message = existingUser.username === normalizedUsername
                ? "Username is already taken."
                : "Email is already registered.";
            return renderSignupError(message);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;

        try {
            newUser = await User.create({
                username: normalizedUsername,
                email: normalizedEmail,
                password: hashedPassword,
                role: "owner",
                gender,
                level: ["beginner", "intermediate", "expert"].includes(level) ? level : "beginner"
            });

            await Owner.create({
                user: newUser._id,
                fullName: typeof fullName === "string" && fullName.trim() ? fullName.trim() : normalizedUsername,
                ...(typeof phone === "string" && phone.trim() ? { phone: phone.trim() } : {}),
                ...(typeof garageName === "string" && garageName.trim()
                    ? { garageName: garageName.trim() }
                    : {})
            });
        } catch (error) {
            if (newUser) {
                try {
                    await User.deleteOne({ _id: newUser._id });
                } catch (cleanupError) {
                    console.error("Failed to remove user after owner profile creation failed:", cleanupError);
                }
            }
            throw error;
        }

        res.redirect("/auth/login");
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0];
            const message = duplicateField === "email"
                ? "Email is already registered."
                : "Username is already taken.";
            return renderSignupError(message);
        }

        console.error("Account registration failed:", error);
        return renderSignupError("Unable to create your account. Please try again.");
    }
};

const ownerLogin = (req, res) => {
    res.render("auth/login.ejs", { error: null, identifier: "" });
};

const loginUser = async (req, res) => {
    const { username, password } = req.body || {};
    const identifier = typeof username === "string" ? username.trim() : "";

    const renderLoginError = (message, status = 400) => {
        res.status(status).render("auth/login.ejs", {
            error: message,
            identifier
        });
    };

    if (!identifier || typeof password !== "string" || !password) {
        return renderLoginError("Enter your username or email and password.");
    }

    try {
        const userInDatabase = identifier.includes("@")
            ? await User.findOne({ email: identifier.toLowerCase() })
            : await User.findOne({ username: identifier.toLowerCase() });

        if (!userInDatabase || !(await bcrypt.compare(password, userInDatabase.password))) {
            return renderLoginError("Login failed. Please check your credentials.", 401);
        }

        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id,
            role: userInDatabase.role
        };

        return res.redirect("/");
    } catch (error) {
        console.error("Login failed:", error);
        return renderLoginError("Unable to log in right now. Please try again.", 500);
    }
};

const logoutUser = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            req.session.destroy((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });

        res.clearCookie("connect.sid", { path: "/" });
        return res.redirect("/");
    } catch (error) {
        console.error("Logout failed:", error);
        return res.status(500).render('error.ejs', { message: "Unable to log out. Please try again." });
    }
};

module.exports = {
    ownerSignup,
    signupUser,
    ownerLogin,
    loginUser,
    logoutUser
};