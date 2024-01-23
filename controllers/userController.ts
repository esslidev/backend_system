import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getUser = async (req: Request, res: Response) => {
  try {
    const { thirdPartyId, accessToken } = req.query;

    // Validation
    if (!thirdPartyId || !accessToken) {
      return res.status(400).json({
        error: "Missing required fields.",
        message: "The server cannot or will not process the request due to missing required fields.",
      });
    }

    // Additional input validation (adjust as needed)
    if (typeof thirdPartyId !== "string" || typeof accessToken !== "string") {
      return res.status(400).json({
        error: "Invalid input format.",
        message: "The provided input does not meet the required format.",
      });
    }

    // Find a user by thirdPartyId
    const user: Partial<User> | null = await prisma.user.findUnique({
      where: {
        thirdPartyId: thirdPartyId,
        accessToken: accessToken,
      },
    });

    // Check if the user exists
    if (user) {
      const responseUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        spokenLanguage: user.spokenLanguage,
        learningLanguage: user.learningLanguage,
        // Include other properties you need...
      };
      res.status(200).json(responseUser);
    } else {
      // Send a response indicating that the user does not exist
      res.status(404).json({
        error: "User not found",
        message: "The requested resource could not be found on the server.",
      });
    }
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error fetching user:", err);
    // Send a more informative error response
    res.status(500).json({
      error: "Internal server error.",
      message: "A generic error message returned when an unexpected condition was encountered.",
    });
  }
};

const setUser = async (req: Request, res: Response) => {
  const { thirdPartyId, accessToken, email, firstName, lastName, thirdPartyProvider, profilePictureUrl } = req.body;

  console.log(`------CREATE------`);

  console.log(`third party id: ${thirdPartyId}`);
  console.log(`access token: ${accessToken}`);
  console.log(`email: ${email}`);
  console.log(`first name: ${firstName}`);
  console.log(`last name: ${lastName}`);
  console.log(`third party provider: ${thirdPartyProvider}`);
  console.log(`image url: ${profilePictureUrl}`);

  try {
    // Validation
    if (!thirdPartyId || !accessToken) {
      return res.status(400).json({
        error: "Missing required fields.",
        message: "The server cannot or will not process the request due to a missing required fields.",
      });
    }
    // Find a user by thirdPartyId
    const existingUser = await prisma.user.findUnique({
      where: { thirdPartyId },
    });

    // Check if the user exists
    if (existingUser === null) {
      // Create a new user
      await prisma.user.create({
        data: {
          thirdPartyId,
          accessToken,
          email,
          firstName,
          lastName,
          thirdPartyProvider,
          profilePictureUrl,
        },
      });

      // Send a success response
      res.status(200).json({ success: true, status: "Created" });
    } else {
      await prisma.user.update({
        where: { thirdPartyId },
        data: { accessToken },
      });
      // Send a response indicating that the user already exists
      res.status(200).json({ success: true, status: "Conflict" });
    }
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error creating user:", err);

    // Send a more informative error response
    res.status(500).json({
      error: "Internal server error.",
      message: "A generic error message returned when an unexpected condition was encountered.",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const {
    thirdPartyId,
    accessToken,
    email,
    firstName,
    lastName,
    thirdPartyProvider,
    profilePictureUrl,
    spokenLanguage,
    learningLanguage,
  } = req.body;

  console.log(`------UPDATE------`);

  console.log(`third party id: ${thirdPartyId}`);
  console.log(`access token: ${accessToken}`);
  console.log(`email: ${email}`);
  console.log(`first name: ${firstName}`);
  console.log(`last name: ${lastName}`);
  console.log(`third party provider: ${thirdPartyProvider}`);
  console.log(`image url: ${profilePictureUrl}`);
  console.log(`spoken language: ${spokenLanguage}`);
  console.log(`learning language: ${learningLanguage}`);

  try {
    // Validation
    if (!thirdPartyId || !accessToken) {
      return res.status(400).json({
        error: "Missing required fields.",
        message: "The server cannot or will not process the request due to a missing required fields.",
      });
    }

    const updatedUserData = {
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(thirdPartyProvider && { thirdPartyProvider }),
      ...(profilePictureUrl && { profilePictureUrl }),
      ...(spokenLanguage && { spokenLanguage }),
      ...(learningLanguage && { learningLanguage }),
    };

    let updateUser = await prisma.user.update({
      where: {
        thirdPartyId,
        accessToken,
      },
      data: updatedUserData,
    });
    const responseUser = {
      email: updateUser.email,
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      profilePictureUrl: updateUser.profilePictureUrl,
      spokenLanguage: updateUser.spokenLanguage,
      learningLanguage: updateUser.learningLanguage,
    };

    res.status(200).json(responseUser);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating user:", error);

    // Send a more informative error response
    res.status(500).json({
      error: "Internal server error.",
      message: "A generic error message returned when an unexpected condition was encountered.",
    });
  }
};

module.exports = {
  getUser,
  setUser,
  updateUser,
};
