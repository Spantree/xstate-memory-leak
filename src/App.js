import { useActor } from '@xstate/react';
import _ from 'lodash';
import { assign, createMachine, interpret } from 'xstate';

import './App.css';

const NUM_FIELDS = 100;
const NUM_ROWS = 1200;

function generateData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rows = [];
      for (let i = 0; i < NUM_ROWS; i++) {
        const row = {};
        for (let j = 0; j < NUM_FIELDS; j++) {
          row[_.uniqueId('field')] = Math.random();
        }
        rows.push(row);
      }
      resolve({ rows });
    }, 3000);
  });
}

let currentState = '(begin)';

const logger = (state) => {
  const previousState = currentState;
  currentState = state;
  console.log(`${previousState} to ${currentState}`);
};

const machine = createMachine(
  {
    key: 'test',
    initial: 'initial',
    strict: true,
    preserveActionOrder: true,

    context: {
      data: 0,
    },

    states: {
      entry: [(context, event) => logger('entry state')],
      initial: {
        after: {
          INITIAL_WAIT: {
            target: 'active',
          },
        },
      },

      active: {
        entry: [(context, event) => logger('active state')],
        after: {
          POLLING_INTERVAL: {
            target: 'fetching',
          },
        },
      },

      fetching: {
        entry: [(context, event) => logger('fetching state')],
        invoke: {
          src: 'loadData',
          onDone: {
            target: 'active',
            actions: ['updateData'],
          },
          onError: {
            target: 'active',
          },
        },
      },
    },
  },
  {
    delays: {
      INITIAL_WAIT: 2000,
      POLLING_INTERVAL: 10000,
    },

    actions: {
      updateData: assign({
        data: (context, { data }) => {
          return data.rows;
        },
      }),
    },

    services: {
      loadData: async () => await generateData(),
    },
  },
);

export const actor = interpret(machine);
actor.start();

function App() {
  const [current] = useActor(actor);
  return (
    <div className="App">
      <header className="App-header">
        <p>XState Memory Test</p>
        <pre>{JSON.stringify(current.value)}</pre>
        <pre>{JSON.stringify(current.context, null, 3)}</pre>
      </header>
    </div>
  );
}

export default App;
