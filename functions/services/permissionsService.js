export class PermissionsService {
  constructor(database) {
    this.permissionsCollection = database.collection("permissions");

    if (!this.permissionsCollection) {
      throw new Error("Unable to establish a collection handle in permissionsService");
    }
  }

  async getPermissions() {
    return await this.permissionsCollection.find({}).toArray();
  }

  async getPermissionsByUserId(userId) {
    return await this.permissionsCollection.findOne({ userId });
  }

  async addPermissions(permissions) {
    const result = await this.permissionsCollection.insertOne(permissions);

    if (!result.insertedId) {
      throw new Error("Error creating permissions");
    }

    return result.insertedId;
  }

  async updatePermissions(userId, permissions) {
    const result = await this.permissionsCollection.updateOne({ userId }, { $set: permissions });

    if (!result.modifiedCount) {
      throw new Error("Error updating permissions");
    }

    return result.modifiedCount;
  }

  async deletePermissions(userId) {
    const result = await this.permissionsCollection.deleteOne({ userId });

    if (!result.deletedCount) {
      throw new Error("Error deleting permissions");
    }

    return result.deletedCount;
  }
}
