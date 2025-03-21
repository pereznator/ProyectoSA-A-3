const getNonNullValue = (body, query) => {
  if (body) {
    return body;
  } else {
    return query;
  }
};

const formatCognitoInfo = (info) => {
  return new Promise((resolve, reject) => {
    let usr = {};
    try {
      info.UserAttributes.map((current, index) => {
        usr[current.Name] = current.Value;
        if (index == info.UserAttributes.length - 1) {
          resolve(usr);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = { getNonNullValue,formatCognitoInfo };
