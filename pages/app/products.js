import React, { useState, useEffect } from 'react';

import PageTitle from 'components/Typography/PageTitle';
import response from 'utils/demo/tableData';
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow
} from '@windmill/react-ui';

import CRUDTable,
{
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from 'react-crud-table';

const DescriptionRenderer = ({ field }) => <textarea {...field} />;

let tasks = [
  {
    id: 1,
    title: 'Create an example',
    description: 'Create an example of how to use the component',
  },
  {
    id: 2,
    title: 'Improve',
    description: 'Improve the component!',
  },
];

const SORTERS = {
  NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
};

const getSorter = (data) => {
  const mapper = x => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === 'id') {
    sorter = data.direction === 'ascending' ?
      SORTERS.NUMBER_ASCENDING(mapper) : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter = data.direction === 'ascending' ?
      SORTERS.STRING_ASCENDING(mapper) : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};


let count = tasks.length;
const service = {
  fetchItems: (payload) => {
    let result = Array.from(tasks);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  },
  create: (task) => {
    count += 1;
    tasks.push({
      ...task,
      id: count,
    });
    return Promise.resolve(task);
  },
  update: (data) => {
    const task = tasks.find(t => t.id === data.id);
    task.title = data.title;
    task.description = data.description;
    return Promise.resolve(task);
  },
  delete: (data) => {
    const task = tasks.find(t => t.id === data.id);
    tasks = tasks.filter(t => t.id !== task.id);
    return Promise.resolve(task);
  },
};

function ProductsPage() {
  return (
    <div className='md:px-8 sm:px-20'>
      <PageTitle>Products</PageTitle>

      {/* <!-- Cards --> */}
      <div className='grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-1'>
          <CRUDTable
            caption="Products"
            fetchItems={payload => service.fetchItems(payload)}
          >
            <Fields>
              <Field
                name="id"
                label="Id"
                hideInCreateForm
                readOnly
              />
              <Field
                name="title"
                label="Title"
                placeholder="Title"
              />
              <Field
                name="description"
                label="Description"
                render={DescriptionRenderer}
              />
            </Fields>
            <CreateForm
              title="Product Creation"
              message="Create a new product!"
              trigger="Create Product"
              onSubmit={task => service.create(task)}
              submitText="Create"
              validate={(values) => {
                const errors = {};
                if (!values.title) {
                  errors.title = 'Please, provide product\'s title';
                }

                if (!values.description) {
                  errors.description = 'Please, provide product\'s description';
                }

                return errors;
              }}
            />

            <UpdateForm
              title="Product Update Process"
              message="Update product"
              trigger="Update"
              onSubmit={task => service.update(task)}
              submitText="Update"
              validate={(values) => {
                const errors = {};

                if (!values.id) {
                  errors.id = 'Please, provide id';
                }

                if (!values.title) {
                  errors.title = 'Please, provide product\'s title';
                }

                if (!values.description) {
                  errors.description = 'Please, provide product\'s description';
                }

                return errors;
              }}
            />

            <DeleteForm
              title="Product Delete Process"
              message="Are you sure you want to delete the product?"
              trigger="Delete"
              onSubmit={task => service.delete(task)}
              submitText="Delete"
              validate={(values) => {
                const errors = {};
                if (!values.id) {
                  errors.id = 'Please, provide id';
                }
                return errors;
              }}
            />
          </CRUDTable>
      </div>
    </div>
  );
}

export default ProductsPage;
