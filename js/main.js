let eventBus = new Vue();

Vue.component('column', {
    props:{
        column_name: {
            type : String,
            required : true
        },
        id: {
            type: String,
            required: true,
        },
        arr:{
            type: Array,
            required: true,
        }
    },
    template:`
    <div class="column">
        <h2>{{ column_name }}</h2>
        <div class="task_space" v-if="arr.length" v-for="(list, index) in arr">
            <h2>{{list.title}}</h2>
            <p><input type="checkbox" @click="checkboxClick(index, 1)" v-model="arr[index].activity.task1">{{list.task1}}</p>
            <p><input type="checkbox" @click="checkboxClick(index, 2)" v-model="arr[index].activity.task2">{{list.task2}}</p>
            <p><input type="checkbox" @click="checkboxClick(index, 3)" v-model="arr[index].activity.task3">{{list.task3}}</p>
            <p v-if="list.task4"><input type="checkbox" @click="checkboxClick(index, 4)" v-model="arr[index].activity.task4">{{list.task4}}</p>
            <p v-if="list.task5"><input type="checkbox" @click="checkboxClick(index, 5)" v-model="arr[index].activity.task5">{{list.task5}}</p>
        </div>
    </div>
`,
    data() {
        return {    

        }
    },
    methods:{
        checkboxClick(firstId, secondId){
            let el;
            firstId = parseInt(firstId);

            el = this.arr[firstId];
                
            if(el){
                switch(secondId){
                    case 1:
                        el.active.task1 = !el.active.task1;
                        break;
                    case 2:
                        el.active.task2 = !el.active.task2;
                        break;
                    case 3:
                        el.active.task3 = !el.active.task3;
                        break;
                    case 4:
                        el.active.task4 = !el.active.task4;
                        break;
                    case 5:
                        el.active.task5 = !el.active.task5;
                        break;
                }
                eventBus.$emit('check-activity', firstId, this.id);
                console.log(el.active);
            }
        },
    }
})


Vue.component('creator', {
    template: `
        <div class="form_box">
            <form class="review-form">
                <div class="errors_output" v-if="{hidden: errors}" v-for="er in errors">
                    <p v-if="{hidden: errors}">{{ er }}</p>
                </div>
                <p class="large_input">
                    <label for="name"><b>Заголовок:</b></label>
                    <input type="text" v-model="list.title">
                </p>
                <p class="regular_input">
                    <label for="name">Задача-1:</label>
                    <input type="text" v-model="list.task1">
                </p>
                <p class="regular_input">
                    <label for="name">Задача-2:</label>
                    <input type="text" v-model="list.task2">
                </p>
                <p class="regular_input">
                    <label for="name">Задача-3:</label>
                    <input type="text" v-model="list.task3">
                </p>
                <p class="regular_input"  v-if="!hiddenFlag4">
                    <label for="name">Задача-4:</label>
                    <input type="text" v-model="list.task4">
                </p>
                <p class="regular_input"  v-if="!hiddenFlag4 && !hiddenFlag5">
                    <label for="name">Задача-5:</label>
                    <input type="text" v-model="list.task5">
                </p>
                <button class="btn" @click.prevent="addTask" v-if="hiddenFlag5">+++</button><br>
                <button class="btn" @click.prevent="customSubmit">Создать</button>
            </form>
        </div>
  `,
    data() {
        return {
            hiddenFlag4: true,
            hiddenFlag5: true,
            errors: [],
   
            list: {
                title: null,
                task1: null,
                task2: null,
                task3: null,
                task4: null,
                task5: null,
                activity:{
                    task1: false,
                    task2: false,
                    task3: false,
                    task4: false,
                    task5: false,
                }
            },
        }
    },
    mounted(){
        eventBus.$on('checkCosponse', function(){
            
        }.bind(this))
    },
    methods:{
        addTask(){
            if(this.hiddenFlag4){
                this.hiddenFlag4 = false;
            }else{
                this.hiddenFlag5 = false;
            }
        },
        customSubmit(){ //Проверил, объект copy - валиден
            this.errors = [];
            if(!this.list.title){
                this.errors.push("Добавьте заголовок.");
            }
            if(!this.list.task1 || !this.list.task2 || !this.list.task3){
                this.errors.push("Первые три задачи обязательны к заполнению.");
            }

            if(!(this.errors).length){
                    let copy = Object.assign({}, this.list)
                    copy.activity = Object.assign({}, this.list.activity);
                    eventBus.$emit('form-created', copy);

                    this.list.title = null; 
                    this.list.task1 = null; 
                    this.list.task2 = null;
                    this.list.task3 = null;
                    this.list.task4 = null;
                    this.list.task5 = null;
                    
                }else{
                    this.errors = ['Достигнуто максимальное колличество списков в первом столбце.'];
                }
            
        
            
        }
    }
})


let app = new Vue({
    el: '#app',
    data(){
        return {
            tasks :[],
            tasks_in_process: [],
            tasks_finished: [],
        }
    },
    mounted(){
        eventBus.$on('form-created', function(list){//Проверил, получаемый объект валиден.
            this.tasks.push(list);
            console.log(this.tasks[0].task1)
        }.bind(this))
    }
})