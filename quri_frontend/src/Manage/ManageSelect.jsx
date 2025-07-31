import React, {useState} from 'react'
import { InputContainer, InputLabel } from './ManageStyledComponents'
import { FormGroup } from 'reactstrap'
// import { useSelector } from 'react-redux'
// import { selectThemeColors } from "@utils"
import {components} from "react-select"
import Select from "react-select"
import Loader from './Loader'

const ManageSelect = ({ inputChanged, width,labelWidth,marginBottom, name, type="single", id, label, formGroupStyle, pos, ...props}) => {

    console.log('PP====', props)
    const [formID,setFormID]=useState(id)

  return (
    <InputContainer width={width} marginBottom={marginBottom || '0'}>
        <FormGroup style={formGroupStyle}>
            <InputLabel style={{fontWeight:`${name==="Report" && "bold"}`,width:labelWidth}} for={id}>
                {label}
            </InputLabel>
            <ManageSingleSelect id={id} {...props} />
        </FormGroup>
    
    </InputContainer>
  )
}

const ManageSelectComponent = ({ isSearchable=true ,isMulti,id,zIndex, defaultValue, options, onChange, isClearable=false, errorStyle,borderCondition, isDisabled=false,inputChanged,width, ...props })  => {
    const [value,setValue]=useState(defaultValue?defaultValue:'')

    // const color = useSelector(state => state.themeColor.color)

    return (
        <div tabIndex='-1' id={id} style={{position: `${props?.style?.position? "relative":""}`, borderRadius: "5px",zIndex:`${zIndex || '2'}`}}>
            <Select
            isSearchable={isSearchable}
                // style={{width:width}}
                
                isMulti={isMulti}
                isDisabled={isDisabled}
                id={id}
                // theme={selectThemeColors}
                className="react-select p-0 m-0"
                classNamePrefix="select"
                value={value}
                options={options}
                onChange={(e)=>{
                    onChange(e);
                    setValue(e);
                } }
                isClearable={isClearable}
                components={{ MenuList: SelectMenuButton }}
                onInputChange = {inputChanged}
                
            />
        </div>
        
    )
}

const ManageSingleSelect = ({ loadingCondition, ...props }) => {
    return (
        <>
            {loadingCondition ? <Loader/> : <ManageSelectComponent {...props} />}
        </>
    ) 
}
const SelectMenuButton = (props) => {

    return (
        <components.MenuList  {...props}>
            {props.children}
            {/* {props.children.length && props.children.length>0? props.children:''}
            {props.children.length===undefined?<Button className='w-100' color='primary'>Add new</Button>:""} */}
            
        </components.MenuList >
    ) }

export default ManageSelect
