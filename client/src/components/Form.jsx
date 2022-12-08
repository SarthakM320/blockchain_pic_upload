import {Context} from '../context/Context'
import {useContext} from 'react';


const Input = ({placeholder,name,type,value,handleChange}) => (
    <input 
    placeholder={placeholder} 
    name={name} 
    type={type} 
    step={0.0001} 
    value={value} 
    onChange={(e) => handleChange(e,name)}
    className="my-2 rounded-small p-2 outline-none bg-transparent text-black border-none text-sm"
    >
        
    </input>
);



const form = () => {
    const {currentAccount,connectWallet,uploadData,isLoading,setFormData,handleChange,formData,base64,setBase64} = useContext(Context);

    const handleSUBMIT =async (e) => {
        const {name,image} = formData;
        

        e.preventDefault; 

        if(!name||!image){
            return ;
        }

        uploadData();
    }

    return (
        <div>
            <div>
                {!currentAccount && (<button 
                    type="button" 
                    className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]" 
                    onClick={connectWallet}>
                        <p className="text-white text-base font-semibold">Connect Wallet</p>
                    </button>)}
            </div>
            <form action="#" method="post" enctype="multipart/form-data">

                <div className="mb-1">
                    Image <span className="font-css top">*</span>
                    <div className="">
                        <Input placeholder="Image" name="image" type="file" handleChange={handleChange}/>
                    </div>
                </div>
                <div className="mb-1">
                    <label htmlFor="name">Name</label> <br/>
                    <Input placeholder="Name" name="name" type="text" handleChange={handleChange}/>
                </div>
                {!isLoading && (<button onClick={(e)=> handleSUBMIT(e)} type="button" 
                    className="text-black mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
                >
                    Send To Blockchain
                </button>)}
                {isLoading && (<button onClick={(e)=> {}} type="button" 
                    className="text-black mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
                >
                    Loading 
                </button>)}
            </form> 
        </div>
    );
}

export default form