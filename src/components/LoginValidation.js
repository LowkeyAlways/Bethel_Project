/* eslint-disable no-unused-vars */
function validation(email, password) {
    let errors = {};
    const email_patterns = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const password_patterns = /^[a-zA-Z0-9]{8,}$/;
    if (email === "") {
      errors.email = "Veuillez entrez votre email";
    } else if (!email_patterns.test(email)) {
      errors.email = "Veuillez entrez un email valide";
    } else {
      errors.email = "";
    }
  
    if (password === "") {
      errors.password = "Veuillez entrez votre mot de passe";
    } else if (!password_patterns.test(password)) {
      errors.password = "Veuillez entrez un mot de passe valide";
    } else {
      errors.password = "";
    }
  
    return errors;
  }
  
  export default validation;