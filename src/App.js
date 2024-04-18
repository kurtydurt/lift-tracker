import { useState, useEffect } from 'react';
import { supabase} from './supabaseClient.js';
import './App.css';


function Workouts() {
    const [myWorkouts, setMyWorkouts] = useState([]); //All Workouts
    const [workout, setWorkout] = useState({ workout_name: '',}); //Workout being added/entered
    const [exercise, setExercise] = useState({id: '', name: '', reps: '', weight: '', sets: '', rpe: '', workout_id: 0});
    const [selectedId, setSelectedId] = useState() //Selected workout to view/edit
    const [selectedExercises, setSelectedExercises] = useState([]) //Exercises in selected workout
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

    async function deleteWorkout(workout_id){
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', workout_id)
        getWorkouts();
    }

    async function getSelectedExercises(workout_id){
        setSelectedId(workout_id);
        let { data: exercises, error } = await supabase
            .from('exercises')
            .select("*")
            .eq('workout_id', workout_id)
        setSelectedExercises(exercises);
    }

    async function deleteExercise(exercise_id, workout_id){
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', exercise_id)
        getSelectedExercises(workout_id);
    }

    async function postExercise() {
        const { data, error } = await supabase
            .from('exercises')
            .insert([{ name: exercise.name, reps: exercise.reps, weight: exercise.weight, sets: exercise.sets, rpe: exercise.rpe, workout_id: selectedId}])
            .single();

        if (error) {
            console.error('Error posting data:', error);
            return;
        }

        console.log('Data posted successfully:', data);
        setExercise({id: '', name: '', reps: '', weight: '', sets: '', rpe: '', workout_id: 0});
        getSelectedExercises(selectedId);
    }

    async function toWorkouts(){
        setSelectedId('')
    }


    if (selectedId) {
        return (
            <div>
                {
                    selectedExercises.map(e =>
                        <div key={e.id}>
                            <p> {e.name} - {e.weight} lbs - {e.reps} reps - {e.sets} sets - {e.rpe} RPE</p>
                            <button onClick={() => deleteExercise(e.id, e.workout_id)}>Delete Exercise</button>
                        </div>
                    )
                }
                <input type="text" value={exercise.name} placeholder="Exercise name" onChange={x => setExercise({...exercise, name: x.target.value })}/>
                <input type="number" value={exercise.reps} placeholder="Reps" onChange={x => setExercise({...exercise, reps: x.target.value })}/>
                <input type="number" value={exercise.sets} placeholder="Sets" onChange={x => setExercise({...exercise, sets: x.target.value })}/>
                <input type="number" value={exercise.weight} placeholder="Load" onChange={x => setExercise({...exercise, weight: x.target.value })}/>
                <input type="number" value={exercise.rpe} min="1" max="10" placeholder="RPE" onChange={x => setExercise({...exercise, rpe: x.target.value })}/>
                <button onClick={() => postExercise()}>Add Exercise</button>
                <button onClick={() => toWorkouts()}>Return to your Workouts</button>

            </div>
        )
    }

    return (
        <div className="enterWorkout">
            <input type="text" value={workout_name} placeholder="Workout name" onChange={e => setWorkout({...workout, workout_name: e.target.value })}/>
            <button onClick={postWorkout}>Create Workout</button>
            {
                myWorkouts.map(w =>
                    <div key={w.id} id={w.id}>
                        <button onClick={() => getSelectedExercises(w.id)}>{w.workout_name}</button>
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
        <Workouts/>
    </div>
  );
}

export default App;
