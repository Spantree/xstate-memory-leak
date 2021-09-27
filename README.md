## Test XState with repeated loading

This react app was created with create-react-app. It runs a state machine which repeatedly "loads" data and assigns it to the context. 

This is a varstly simplified version of the state machine we actually use for our application, but the essential pieces are there. In the real app we of course load real data from a backend. The durations and the data size are appromately the same as the real application.

The react app displays this data, though the app will leak memory regardles of the React app output.

States:
* initial (transitions to active after 2 sec)
* active (transitions to fetching after 10 sec)
* fetching ("loads" data for 3 sec, onDone transitions back to active)
