import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setSandwichType, addExtra, removeExtra } from '../store/sandwichSlice';
import { RootState } from '../store/store';

interface FormValues {
  customerName: string;
  sdwType: string;
  cheese: boolean;
  tomato: boolean;
}

const SandwichOrderForm: React.FC = () => {
  const dispatch = useDispatch();
  const { sdwType, extras } = useSelector((state: RootState) => state.sandwich);
  const { register, handleSubmit, setValue } = useForm<FormValues>();

  const mutation = useMutation(async (sandwichData: any) => {
    const response = await fetch('https://api.test.example.com/sandwiches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sandwichData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit the sandwich order');
    }
  });

  const onSubmit = (data: FormValues) => {
    const selectedExtras = [
      data.cheese ? 'cheese' : null,
      data.tomato ? 'tomato' : null,
    ].filter((extra) => extra !== null);

    mutation.mutate({
      customerName: data.customerName,
      sdwType,
      extras: selectedExtras,
    });
  };

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const extra = e.target.value;
    if (e.target.checked) {
      dispatch(addExtra(extra));
    } else {
      dispatch(removeExtra(extra));
    }
    setValue(extra, e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="customerName">Customer Name: </label>
        <input id="customerName" {...register('customerName')} />
      </div>
      <div>
        <label htmlFor="sdwType">Sandwich Type: </label>
        <select
          id="sdwType"
          value={sdwType}
          onChange={(e) => dispatch(setSandwichType(e.target.value))}
        >
          <option value="">--Choose a sandwich--</option>
          <option value="turkey">Turkey</option>
          <option value="ham">Ham</option>
          <option value="veggie">Veggie</option>
        </select>
      </div>
      <div>
        <label>Extras:</label>
        <div>
          <input
            type="checkbox"
            id="cheese"
            value="cheese"
            checked={extras.includes('cheese')}
            onChange={handleExtraChange}
            {...register('cheese')}
          />
          <label htmlFor="cheese">Cheese</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="tomato"
            value="tomato"
            checked={extras.includes('tomato')}
            onChange={handleExtraChange}
            {...register('tomato')}
          />
          <label htmlFor="tomato">Tomato</label>
        </div>
      </div>
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default SandwichOrderForm;
