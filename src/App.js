import { useState, useEffect } from 'react';
import { supabase} from './supabaseClient.js';
import './App.css';

function ExerciseEntry() {
  return (
      <form>
        <input type="text" id="name" placeholder="Exercise name"/>
        <input type="number" id="reps" placeholder="Reps"/>
        <input type="number" id="sets" placeholder="Sets"/>
        <input type="number" id="weight" placeholder="Load"/>
        <input type="number" id="rpe" min="1" max="10" placeholder="RPE"/>
          <input type="submit" value="Add Exercise to Workout" />
      </form>
  );
}

function Workouts() {
    const [myWorkouts, setMyWorkouts] = useState([]);
    const [workout, setWorkout] = useState({ workout_name: '',});
    const {workout_name} = workout;
    useEffect(() => {
        getWorkouts()
    }, [])
    async function getWorkouts() {
        let { data: workouts, error} =  await supabase
            .from('workouts')
            .select()
        setMyWorkouts(workouts);
        console.log("workouts:", workouts)
    }
    async function postWorkout() {
        const { data, error } = await supabase
            .from('workouts')
            .insert([workout])
            .single();

        if (error) {
            console.error('Error posting data:', error);
            return;
        }

        console.log('Data posted successfully:', data);
        setWorkout({workout_name: ""});
        getWorkouts();
    }

    async function deleteWorkout(id){
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', id)
        getWorkouts();
    }


    return (
        <div className="enterWorkout">
            <input type="text" value={workout_name} placeholder="Workout name" onChange={e => setWorkout({...workout, workout_name: e.target.value })}/>
            <button onClick={postWorkout}>Create Workout</button>
            {
                myWorkouts.map(w =>
                    <div key={w.id} id={w.id}>
                        <h2>{w.workout_name}</h2>
                        <button onClick={() => deleteWorkout(w.id)}>Delete Workout</button>
                    </div>
                )
            }
        </div>

    );
}

function App() {
  return (
    <div className="App">
      <ExerciseEntry/>
        <Workouts/>
    </div>
  );
}

export default App;
