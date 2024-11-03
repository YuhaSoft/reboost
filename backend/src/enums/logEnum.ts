export enum LogEnum {
    Login = "User ${req.body.username} attempted to log in.",
    Register = "User ${req.body.username} attempted to register.",
    UpdateProfilePhoto = "User ${req.updatedUser.username} attempted to update profile Photo.",
    UpdateProfile = "User ${req.updatedUser.username} attempted to update profile ${(req.body.email)?'email from  to ' + req.body.email : '' } /n ${(req.body.phoneNumber)?'phone Number changed to ' + req.body.phoneNumber : '' }. ",
    UpdatePassword = "User ${req.updatedUser.username} attempted to update Password.",
    UserSelect = "User ${req.selectedUser.username} request profile.",

}
  