const deloService = require('../services/deloService.js');
const loginToDELO = async (req,res) =>{
    const response = await deloService.deloLogin();
    console.log(`Response status of login request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to login!", result: response})
    else
        res.status(500).json({message: "Failed to login!", result: response})
}

const logoutFromDELO = async (req,res) =>{
    const response = await deloService.deloLogout();
    console.log(`Response status of logout request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to logout", result: response})
    else
        res.status(500).json({message: "Failed to logout!", result: response})
}

module.exports.loginToDelo = loginToDELO;
module.exports.logoutFromDelo = logoutFromDELO;