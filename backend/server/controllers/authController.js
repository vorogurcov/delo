import {deloLogin, deloLogout} from "../services/deloService.js";

export const loginToDelo = async (req,res) =>{
    const response = await deloLogin();
    console.log(`Response status of login request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to login!", result: response})
    else
        res.status(500).json({message: "Failed to login!", result: response})
}

export const logoutFromDelo = async (req,res) =>{
    const response = await deloLogout();
    console.log(`Response status of logout request: ${response?.status}`)
    if(response?.status === undefined)
        res.status(200).json({message: "Succeed to logout", result: response})
    else
        res.status(500).json({message: "Failed to logout!", result: response})
}