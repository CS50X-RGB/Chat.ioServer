import nodemailer from 'nodemailer';

const sendEmail = async (userEmail, message) => {
        const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                        user: 'rohanchatterjee866@gmail.com',
                        pass: 'xbxb jvjr vowj kkfd',
                }
        });
        try {
                const info = await transporter.sendMail({
                        from: "rohanchatterjee866@gmail.com",
                        to: userEmail,
                        subject: "Welcome to RohanChat.io",
                        text: message,
                        html: `<div>${message}</div>`
                });

                console.log("Email sent:", info.messageId);
        } catch (error) {
                console.error("Error sending email:", error);
                throw error;
        }
};
export default sendEmail;