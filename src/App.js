import { useState, useEffect } from 'react';
import { supabase} from './supabaseClient.js';
import './App.css';
import logo from './logo.png'


function Workouts() {
    const [myWorkouts, setMyWorkouts] = useState([]); //All Workouts
    const [workout, setWorkout] = useState({ workout_name: '',}); //Workout being added/entered
    const [exercise, setExercise] = useState({id: '', name: '', reps: '', weight: '', sets: '', rpe: '', workout_id: 0});
    const [selectedId, setSelectedId] = useState({id: '', name: ''}) //Selected workout to view/edit
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

    async function getSelectedExercises(workout_id, workout_name){
        setSelectedId({id: workout_id, name:workout_name});
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
        getSelectedExercises(workout_id, selectedId.name);
    }

    async function postExercise() {
        const { data, error } = await supabase
            .from('exercises')
            .insert([{ name: exercise.name, reps: exercise.reps, weight: exercise.weight, sets: exercise.sets, rpe: exercise.rpe, workout_id: selectedId.id}])
            .single();

        if (error) {
            console.error('Error posting data:', error);
            return;
        }

        console.log('Data posted successfully:', data);
        setExercise({id: '', name: '', reps: '', weight: '', sets: '', rpe: '', workout_id: 0});
        getSelectedExercises(selectedId.id, selectedId.name);
    }

    async function toWorkouts(){
        setSelectedId({id:'',name:''})
    }


    if (selectedId.id) {
        return (
            <div className="container">
                <h1>{selectedId.name}</h1>
                {
                    selectedExercises.map(e =>
                        <div className="input-group mb-3 w-50 mx-auto justify-content-center" key={e.id}>
                            <span className="input-group-text">{e.name} - {e.weight} lbs - {e.reps} reps - {e.sets} sets - {e.rpe} RPE</span>
                            <button className="btn btn-outline-danger fw-bold" onClick={() => deleteExercise(e.id, e.workout_id)}>X</button>
                        </div>
                    )
                }
                <div className="input-group mb-3">
                    <input className="form-control" type="text" value={exercise.name} placeholder="Exercise name" onChange={x => setExercise({...exercise, name: x.target.value })}/>
                    <input className="form-control"  type="number" value={exercise.reps} placeholder="Reps" onChange={x => setExercise({...exercise, reps: x.target.value })}/>
                    <input className="form-control"  type="number" value={exercise.sets} placeholder="Sets" onChange={x => setExercise({...exercise, sets: x.target.value })}/>
                    <input className="form-control"  type="number" value={exercise.weight} placeholder="Load" onChange={x => setExercise({...exercise, weight: x.target.value })}/>
                    <input className="form-control"  type="number" value={exercise.rpe} min="1" max="10" placeholder="RPE" onChange={x => setExercise({...exercise, rpe: x.target.value })}/>
                    <button className="btn btn-warning" onClick={() => postExercise()}>Add Exercise</button>

                </div>
                <button className="btn btn-warning" onClick={() => toWorkouts()}>Return to your Workouts</button>

            </div>
        )
    }

    return (
        <div className="enterWorkout container">
            <h1>My Workouts:</h1>
            {
                myWorkouts.map(w =>
                    <div className="btn-group d-block mb-3" key={w.id} id={w.id}>
                        <button className="btn btn-warning" onClick={() => getSelectedExercises(w.id,w.workout_name)}>{w.workout_name}</button>
                        <button className="btn btn-outline-danger fw-bold" onClick={() => deleteWorkout(w.id)}>X</button>
                    </div>
                )
            }
            <div className="input-group">
                <div className="form-floating">
                    <input id="workout_name" className="form-control"  type="text" value={workout_name} placeholder="Workout name" onChange={e => setWorkout({...workout, workout_name: e.target.value })}/>
                    <label for="workout_name">Workout Name</label>
                </div>
                <button className="btn btn-outline-warning" onClick={postWorkout}>Create Workout</button>
            </div>
        </div>

    );
}

function App() {
  return (
    <div className="App">
        <img src={logo} alt="Gorilla Gains Logo"/>
        <Workouts/>
    </div>
  );
}

export default App;
