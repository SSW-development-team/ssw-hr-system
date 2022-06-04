import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

// Create an editable cell renderer
export const IdCell = ({
  value: initialValue,
  row: { index },
  column: { id },
}: any) => {
  return <span>{initialValue}</span>;
};
