export class PermissionsService {
  constructor(database) {
    this.permissionsCollection = database.collection("permissions");
    this.managedPermissionsCollection = database.collection("managedPermissions");

    if (!this.permissionsCollection) {
      throw new Error("Unable to establish a collection handle in permissionsService");
    }

    if (!this.managedPermissionsCollection) {
      throw new Error("Unable to establish a collection handle in permissionsService");
    }
  }

  async getPermissions() {
    try {
      return await this.permissionsCollection.find({}).toArray();
    } catch (error) {
      console.error("Error fetching permissions:", error);
      throw new Error("Failed to fetch permissions");
    }
  }

  async getPermissionsByUserId(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    try {
      const permissions = await this.managedPermissionsCollection.findOne({ userId });
      if (!permissions) {
        return null; // Return null if no permissions found for the user
      }
      return permissions;
    } catch (error) {
      console.error(`Error fetching permissions for user ${userId}:`, error);
      throw new Error("Failed to fetch user permissions");
    }
  }

  async addPermissions(permissions) {
    if (!permissions || typeof permissions !== "object") {
      throw new Error("Invalid permissions object");
    }
    try {
      const result = await this.permissionsCollection.insertOne(permissions);
      if (!result.insertedId) {
        throw new Error("Failed to create permissions");
      }
      return result.insertedId;
    } catch (error) {
      console.error("Error adding permissions:", error);
      throw new Error("Failed to add permissions");
    }
  }

  async updatePermissions(userId, permissions) {
    if (!userId || !permissions || typeof permissions !== "object") {
      throw new Error("Invalid userId or permissions object");
    }
    try {
      const result = await this.permissionsCollection.updateOne({ userId }, { $set: permissions }, { upsert: true });
      if (!result.modifiedCount && !result.upsertedCount) {
        throw new Error("No permissions were updated or inserted");
      }
      return result.modifiedCount || result.upsertedCount;
    } catch (error) {
      console.error(`Error updating permissions for user ${userId}:`, error);
      throw new Error("Failed to update permissions");
    }
  }

  async deletePermissions(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    try {
      const result = await this.permissionsCollection.deleteOne({ userId });
      if (!result.deletedCount) {
        throw new Error("No permissions found to delete");
      }
      return result.deletedCount;
    } catch (error) {
      console.error(`Error deleting permissions for user ${userId}:`, error);
      throw new Error("Failed to delete permissions");
    }
  }
}
