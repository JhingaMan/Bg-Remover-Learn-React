import { Webhook } from "svix";
import userModel from "../models/usermodel.js";

// API Controller Function to Manage Clerk User with Database
const clerkWebhooks = async (req, res) => {
  try {
    // Create svix instance with clerk webhook secret key
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    console.log("CLERK_WEBHOOK_SECRET:", process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook signature
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    console.log("Verified Webhook Type:", type);
    console.log(data);
    console.log(type);

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        await userModel.create(userData);
        res
          .status(200)
          .json({ success: true, message: "User created successfully" });
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        res
          .status(200)
          .json({ success: true, message: "User updated successfully" });
        break;
      }
      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res
          .status(200)
          .json({ success: true, message: "User deleted successfully" });
        break;
      }
      default:
        res
          .status(400)
          .json({ success: false, message: "Unhandled event type" });
        break;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//API  controller function to get user available credits  data
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;

    const userData = await userModel.findOne({ clerkId });

    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { clerkWebhooks , userCredits};