import React, {useState,useEffect} from 'react';
import {ethers} from 'ethers';
// import {ipfs} from "./ipfs"
import {Buffer} from 'buffer';
import axios from 'axios';
import { apiKey,secretKey, jwtToken}  from '../utils/keys';
import {contractABI,contractAddress} from "../utils/constants"
// import {fs} from 'fs';
// import {pinataSDK} from '@pinata/sdk';
// // const pinataSDK = require('@pinata/sdk');
// const pinata = new pinataSDK(apiKey, secretKey);

export const Context = React.createContext()



const {ethereum} = window

const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer);
    // console.log({
    //     provider,
    //     signer,
    //     transactionContract
    // });
    return transactionContract;
}






export const ContextProvider = ({children}) =>{

    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({name:'',image:''})
    const [isLoading, setIsLoading] = useState(false)
    const [buffer, setBuffer] = useState('' )
    const [ipfsHash,setHash] = useState('')
    

    const checkIfWalletIsConnected = async() => {
        try{
            if(!ethereum) return alert('Please install metamask');
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if(accounts.length){
                setCurrentAccount(accounts[0]);
                //getAllTransactions
            }else{
                console.log('No accounts found')
            }
            console.log('hello this is accounts ',accounts);
        }catch(error){
            console.log(error);
            throw new Error('No Ethereum object')
        }
    }

    const connectWallet = async() => {
        try{
            if(!ethereum) return alert('Please install metamask');
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        }catch(error){
            console.log(error);
            throw new Error('No Ethereum object')
        }
    }

    const handleChange = async (e, name) => {
        // console.log(e)
        
        try{
            const file = e.target.files[0]
            let reader = new window.FileReader()
            // reader.readAsArrayBuffer(file)
            // reader.onloadend = () => {
            //     console.log("Buffer data: ", Buffer(reader.result));
            //     setBuffer(Buffer(reader.result));
            // } 

            setBuffer(file)                    
             
            // ipfs.add(this.state.buffer, (err, ipfsHash) => {
            //     console.log(err,ipfsHash);
            //     setHash(ipfsHash[0].hash);
            // });
        }catch(error){
            // console.log(error);
        }
        setFormData((prevState)=> ({...prevState,[name]:e.target.value})) //important
    }

    const pinIPFS = async() => {
        const data = new FormData();
        data.append("file", buffer);
        
        const metadata = JSON.stringify({
            name: 'Image Buffer',
        });
        data.append('pinataMetadata', metadata);
        
        const options = JSON.stringify({
            cidVersion: 0,
        })
        data.append('pinataOptions', options);
        
        
        try{
            const resFile = await axios({
                method: 'post',
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                
                data: data,
                headers: {
                    'pinata_api_key': apiKey,
                    'pinata_secret_api_key': secretKey,
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                },
            });
            return resFile;
        }catch(error){
            console.log(error)
        }
    }

    

    const uploadData = async () => {
        try{
            if(!ethereum) return alert('Please install metamask');
            //get the data from the form
           
            // const created = await client.add(buffer);
            // console.log(created)
            const {name, image} = formData;
            const transactionContract = getContract(); 

            const resFile = await pinIPFS();
            // await pinIPFS2();
     
            const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
            console.log(ImgHash); 
            console.log('Transaction under way');
            setIsLoading(true);
            const transactionhash = await transactionContract.uploadImage(ImgHash,name);
            console.log(transactionhash);
            console.log('Loading, transaction hash: ' + transactionhash.hash);
            await transactionhash.wait();
            setIsLoading(false);
            console.log('Done');
        }catch(error){
            console.log(error);
            throw new Error('No Ethereum object')
        }
    }


    useEffect(
        () => {checkIfWalletIsConnected();
    },[]);

    return (
        <Context.Provider value={{connectWallet,currentAccount,formData, setFormData,handleChange,isLoading, uploadData,base64: buffer,setBase64: setBuffer}}>
            {children}
        </Context.Provider>
    );
}