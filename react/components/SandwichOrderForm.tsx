import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

const fetchSandwiches =  async () => {
  return [
    {
      name: "sandwich 1"
    },
    {
      name: "sandwich 2"
    }
  ]
}

interface FormValues {
  selectedOption: string;
}

const StyledLabel = styled.label`
  color: red;
  font-size: 12px;
`

const MyForm = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const dispatch: Dispatch<any> = useDispatch();

  const {data, isError, isLoading, isSuccess} = useQuery({
    queryFn: () => fetchSandwiches(),
    queryKey: ["sandwiches"]
  })

  const onSubmit = (data: FormValues) => {
    dispatch({ type: 'OPTION_SELECTED', payload: { selectedOption: data.selectedOption } });
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div>
        Error fetching sandwiches
      </div>
    )
  }


  const sandwichOptions = data.map((sandwich) => {
    return {
      label: sandwich.name,
      value: sandwich.name
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StyledLabel htmlFor="selectedOption">Select an option:</StyledLabel>
      <select id="selectedOption" {...register('selectedOption')}>
        {sandwichOptions.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
