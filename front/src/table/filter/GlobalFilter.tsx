import { Col, Container, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import {
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from 'react-table';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GlobalFilter<D extends Record<string, any>>({
  setGlobalFilter,
}: Pick<UseGlobalFiltersInstanceProps<D>, 'setGlobalFilter'> &
  UseGlobalFiltersState<D>) {
  const [reEnroll, setReEnroll] = useState(false);
  const [isExist, setIsExist] = useState(true);

  useEffect(
    () =>
      setGlobalFilter({
        reEnroll,
        isExist,
      }),
    [reEnroll, isExist]
  );

  return (
    <Container fluid>
      <Row>
        <Col xs="auto">
          <Form.Check
            id="reEnroll"
            checked={reEnroll}
            label="再加入者のみ表示"
            onChange={(e) => setReEnroll(e.target.checked)}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            id="isExist"
            checked={isExist}
            label="在籍者のみ表示"
            onChange={(e) => setIsExist(e.target.checked)}
          />
        </Col>
      </Row>
    </Container>
  );
}

export type GlobalFilterValue = {
  reEnroll: boolean;
  isExist: boolean;
};
