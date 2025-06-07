import React from 'react';
import Form from '../../components/Form';
import NotFound from '@/app/not-found';
import { getDiscount } from '@/services/DiscountService';

type Props = {
  params: Promise<{ id: number }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params; 

  const response = await getDiscount(id);

  if (!response.data) {
    return <NotFound />;
  }
  return <Form discount={response.data} />;
};

export default Page;
