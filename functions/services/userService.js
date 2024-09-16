import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const saltRounds = parseInt(process.env.SALT);

if (!saltRounds || isNaN(saltRounds)) {
  throw new Error("SALT environment variable not set");
}

const jwtHash = process.env.JWT_SECRET;

if (!jwtHash) {
  throw new Error("JWT_SECRET environment variable not set");
}

export class UserService {
  constructor(database) {
    this.usersCollection = database.collection("users");

    if (!this.usersCollection) {
      throw new Error("Unable to establish a collection handle in userService");
    }
  }

  async createCookie(userId) {
    const token = jwt.sign({ userId }, jwtHash, { expiresIn: "1h" });
    const loginCookie = cookie.serialize("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });
    return loginCookie;
  }

  async getAllUsers() {
    return await this.usersCollection.find({}).toArray();
  }

  async getUserById(userId) {
    return await this.usersCollection.findOne({ _id: new ObjectId(userId) });
  }

  async me(userId) {
    return await this.usersCollection.findOne({ _id: new ObjectId(userId) });
  }

  async addUser(user) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const result = await this.usersCollection.insertOne({
      ...user,
      password: hashedPassword,
    });

    if (!result.insertedId) {
      throw new Error("Error creating user");
    }

    return result.insertedId;
  }

  async userLogin(email, password) {
    const user = await this.usersCollection.findOne({ email });

    if (!user) {
      throw new Error("Invalid User Information");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid User Information");
    }

    return user._id;
  }

  async signUp(user) {
    const existingUser = await this.usersCollection.findOne({ email: user.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    return await this.addUser(user);
  }

  async updateUser(userId, userName, email, name, password) {
    console.log("currentUser", currentEmail);
    console.log("userName", userName);
    console.log("email", email);
    console.log("name", name);
    console.log("password", password);
    const user = await this.usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      userName: userName ? userName : user.userName,
      email: email ? email : user.email,
      name: name ? name : user.name,
      password: password ? bcrypt.hashSync(user.password, saltRounds) : user.password,
    };

    const result = await this.usersCollection.findOneAndUpdate(
      { email: currentEmail },
      { $set: updatedUser },
      { returnDocument: "after" }
    );

    console.log("result", result);

    if (!result.value) {
      throw new Error("User not found");
    }

    return result.value;
  }

  async deleteUser(userId) {
    const result = await this.usersCollection.findOneAndDelete({ _id: userId });

    if (!result.value) {
      throw new Error("User not found");
    }

    return result.value;
  }
}
