import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import styled from "styled-components"

interface Props {
  options: string[];
}

const StyledLabel = styled.label`
  color: red;
  font-size: 12px;
`

interface FormValues {
  selectedOption: string;
}

const MyForm: React.FC<Props> = ({ options }) => {
  const { register, handleSubmit } = useForm<FormValues>();
  const dispatch: Dispatch<any> = useDispatch();

  const onSubmit = (data: FormValues) => {
    dispatch({ type: 'OPTION_SELECTED', payload: { selectedOption: data.selectedOption } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StyledLabel >Select an option:</StyledLabel>
      <select id="selectedOption" {...register('selectedOption')}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
