import React, { useEffect, useState } from 'react';
import { Icon } from 'react-icons-kit';
import {ic_edit} from 'react-icons-kit/md/ic_edit';
import {trashO} from 'react-icons-kit/fa/trashO';
import { fs, auth } from "../firebase/index";
import { Link } from 'react-router-dom';

export const Product = ({individualProduct, addToCart}) => {
    // console.log(individualProduct);
    const handleAddToCart=()=>{
        addToCart(individualProduct);
    }   
    const [show , setShow] =useState(false);
    const [authorized, setAuthorized] = useState(false);
    useEffect(() => {
        const subs = auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection("users").doc(user.uid).get().then(snapshot => {
                    if(snapshot.data().role==="admin"){
                        setAuthorized(true);
                    }
                })
            }else{
                setAuthorized(false);
            }
        })
        return  () => subs;
    });
    const deleteProduct = () => {
        fs.collection("Products").doc(individualProduct.ID).delete().then(() => {
            setShow(false);
            window.location.reload();
        }).catch(() => {
            console.log("Unable to delete Products");
        })
    }

    return (
        <>
        <div className='product'>     
        {authorized && <div id="myModal" className="modal" style={{display: show ? "block" : "none"}} >
        <div class="modal-content" onBlur={() => setShow(false)}>
        <div class="modal-header">
            <h3>Confirmation</h3>
            <span class="close" onClick={() => setShow(false)}>&times;</span>
        </div>
        <div class="modal-body">
            <p>SURE YOU WANT TO DELETE {individualProduct.title}</p>
            <button className="btn btn-danger btn-lg" onClick={deleteProduct}>YES DELETE IT</button> 
            <button className="btn btn-success btn-lg" onClick={() => setShow(false)}>CANCEL</button>
        </div>
        </div>
        </div> }            
            <div className='product-img'>
                {authorized && <Link to={`/product/edit/${individualProduct.ID}`} ><button className="edit-product btn btn-success"><Icon icon={ic_edit} />edit</button></Link>}
                <img src={individualProduct.url} alt="product-img"/>
                {authorized && <button onClick={() => setShow(true)} className="del-product btn btn-danger" data-toggle="modal" data-target="#exampleModal"><Icon icon={trashO} />del</button>}
            </div>
            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>₹ {individualProduct.price}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>ADD TO CART</div>
        </div> 
        </>
    )
}