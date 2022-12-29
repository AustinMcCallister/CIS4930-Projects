"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(userId, firstName, lastName, emailAddress, password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    }
    toJSON() {
        return {
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            emailAddress: this.emailAddress
        };
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map