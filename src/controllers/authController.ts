import bcrypt from "bcrypt";
import {prisma} from "../app.ts";
import {generateToken} from "../services/authenticator.ts";

export default class authController {
    /**
     * Registers a new user with the provided email and password.
     *
     * @param req Express request object containing `email` and `password` in the body.
     * @param res Express response object.
     * @returns Responds with a JSON message indicating the registration status.
     *          If the email already exists, returns a 400 status with an error message.
     *          Otherwise, it returns a success message and the newly created user's ID.
     *
     * This function hashes the user's password and stores both email and hashed password in the database.
     * It also assigns the 'client' role to the newly registered user.
     */
    static async register(req: any, res: any) {
        const {email, password} = req.body;

        const userExist = await prisma.users.findFirst({where: {email}});
        if (userExist) return res.status(400).json({message: 'Invalid email or password'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {email, password: hashedPassword},
        });
        const userRole = await prisma.roles.findFirst(
            {
                where: {
                    name: 'client'
                }
            }
        )
        await prisma.usersOnRoles.create({
            data: {
                userId: user.id,
                roleId: userRole?.id || "",
                assignedBy: 'registration',
            }
        })

        res.json({message: 'User registered successfully', userId: user.id});
    }

    /**
     * Login a user and return a JWT token.
     * @param req Express request object.
     * @param res Express response object.
     * @returns Promise that resolves to a JSON response with a JWT token.
     */
    static async login(req: any, res: any): Promise<any> {
        const {email, password} = req.body;

        const user = await prisma.users.findUnique({where: {email}});
        if (!user) return res.status(400).json({message: 'Invalid email or password'});

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({message: 'Invalid email or password'});

        const token = generateToken(user.id);
        res.json({message: 'Login successful', token});
    }
}