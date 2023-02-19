import React ,{useState, useEffect} from "react";
import * as Yup from "yup";
import axios from "axios";
import "./form.css";


const formSchema = Yup.object().shape({
    isim: Yup
      .string()
      .required("*İsim alanı zorunludur")
      .min(5, "İsim en az 5 karakter olmalı"),
    email: Yup
      .string()
      .email("Geçerli e-posta giriniz")
      .required("E-posta alanı zorunludur"),
    password: Yup
      .string()
      .required("Şifre alanı zorunludur")
      .min(6, "Şifreniz 6 karakterden fazla olmalı"),
    KullanimSartlari: Yup
      .boolean()
      .oneOf([true], "Lütfen Şartları Kabul Ediniz")
      
  });


function Adder(props){
const emptyForm={}    
const emptyErrors={isim:"",email:"",password:"",KullanimSartlari:"Lütfen Şartları Kabul Ediniz"}    

const  [user,setUser]=useState(emptyForm);

const[errors,setErrors]= useState(emptyErrors);

const[buttonDisable,setButtonDisable]= useState(true);
const[members,setMembers]=useState([])

useEffect(() => {
    formSchema.isValid(user).then((valid) => 
    setButtonDisable(!valid));
    
  }, [user]);

const checkFormErrors = (name, value)=>{

    Yup
    .reach(formSchema, name)
    .validate(value)
    .then(() => {
      setErrors({
        ...errors, [name]: ""
      });
    })
    .catch(err => {
      setErrors({
        ...errors, [name]: err.errors[0]
      });
    });
    
    };   


const changeHandler=(event)=>{
    const{value,name,type,checked}=event.target
    let nValue= type !=="checkbox" ? value : checked
    checkFormErrors(name,nValue)
    const newState={  
        ...user,[name]:nValue,
    }
    setUser(newState);
  };
  
  const handleSubmit=(id)=>{
    id.preventDefault();
    axios.post("https://reqres.in/api/users",user)
    .then((response)=>setMembers([...members,response.data]));
  console.log(user);
  console.log(members)
  }
   

    return(
     
        <form className="form-list" onSubmit={handleSubmit} style={{display:"grid"}}>
            <label>
                İsim:
                <input
                type="text"
                name="isim"
                id="isim"
                onChange={changeHandler}
               value={user.isim}
                />
                <p className="error">{errors.isim}</p>
            </label>
            <label htmlFor="email">
                email:
                <input type="text"
                name="email"
                id="email"
                onChange={changeHandler}
               value={user.email}
               />
               <p className="error">{errors.email}</p>
            </label>
            <label htmlFor="password">
                Şifre:
                <input type="password"
                name="password"
                id="password"
                onChange={changeHandler}
               value={user.password}/>
               { errors.password !=="" && <p className="error">{errors.password}</p>}
            </label>
            <label htmlFor="KullanimSartlari">
            Kullanım Şartları:
                <input type="checkbox"
                name="KullanimSartlari"
               id="KullanimSartlari"
               checked={user.KullanimSartlari}
               onChange={changeHandler}
          ></input>
            </label>
            <div>{errors.KullanimSartlari !=="" &&<p>{errors.KullanimSartlari}</p>}</div>
            <button  type="submit" name="kayıt" id="submit">Kayıt Ol</button>
          
          

        </form>
     
    )
}
export default Adder;