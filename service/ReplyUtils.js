class ReplyUtils {
  static success = (value) => {
    return {success: true, data: value, message: "success"};
  }

  static fail = (errorMessage) => {
    return {success: false, data: "", message: errorMessage};
  }
}

module.exports = ReplyUtils;
