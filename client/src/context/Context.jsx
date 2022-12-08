import React, {useState,useEffect} from 'react';
import {ethers} from 'ethers';

import {contractABI,contractAddress} from "../utils/constants"

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
    const [base64, setBase64] = useState('')
    

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
            const reader = new FileReader();
            reader.onloadend = () => {
                // Use a regex to remove data url part
                setBase64(reader.result
                    .replace('data:', '')
                    .replace(/^.+,/, ''))
                // Logs wL2dvYWwgbW9yZ...
            };
            reader.readAsDataURL(file);
            console.log(base64)
            // setBase64(base64String);
        }catch(error){
            // console.log(error);
        }
        setFormData((prevState)=> ({...prevState,[name]:e.target.value})) //important
    }

    const uploadData = async () => {
        try{
            if(!ethereum) return alert('Please install metamask');
            //get the data from the form
            const {name, image} = formData;
            console.log({name,base64});
            const transactionContract = getContract(); 
            console.log(transactionContract) 
            // await ethereum.request({
            //     method:'eth_sendTransaction',
            //     params:[{
            //         from:currentAccount,
            //         to:addressTo,
            //         gas:'0x5208',
            //         value:parsedAmount._hex,
            //     }]
            // })
            console.log('Transaction under way');
            
            setIsLoading(true);
            const transactionhash = await transactionContract.uploadImage(base64,name);
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
        <Context.Provider value={{connectWallet,currentAccount,formData, setFormData,handleChange,isLoading, uploadData,base64,setBase64}}>
            {children}
        </Context.Provider>
    );
}