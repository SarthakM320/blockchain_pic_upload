// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract uploadPhoto{
    // uint i=0;
    struct ImageInfo{
        string name;
        string base64_image;
        address owner;
    }

    ImageInfo[]  images;
    mapping(address => uint) public owner_number_images;

    function uploadImage(string memory base64_image, string memory name) external {
        // i++;
        images.push(ImageInfo(name, base64_image,msg.sender));
        owner_number_images[msg.sender]++;
    }

    function retrieve_images () external view returns (string[] memory) {
        string[] memory result = new string[](owner_number_images[msg.sender]);
        uint count = 0;
        for (uint i=0;i<images.length;i++){
            if(images[i].owner == msg.sender){
                result[count] = images[i].base64_image;
                count++;
            }
        }
        return result;
    }
    
}