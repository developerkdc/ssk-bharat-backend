const LoginUser = (req, res) => {
  try {
    let msg = req.user
    return res.send(msg);
  } catch (error) {
    return res.send(error);
  }
}

export default {LoginUser}
