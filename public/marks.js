console.log("marks");

const list=document.getElementById("list").value;
console.log(list);


const arr=JSON.parse(list);
const dept=document.getElementById("dept").value;
const course=document.getElementById("course").value;
const year=document.getElementById("year").value;

let head=document.getElementById("head");
  console.log(arr);
  console.log(dept);
  console.log(course);
  console.log(year);

  let t=document.createElement("th");
  let text=document.createTextNode(`ROLL NO`);
  t.appendChild(text);
  head.appendChild(t);

   t=document.createElement("th");
    text=document.createTextNode(`REG NO`);
t.appendChild(text);
head.appendChild(t);

t=document.createElement("th");
 text=document.createTextNode(`YEAR`);
t.appendChild(text);
head.appendChild(t);


for(let i=1;i<year;i++)
{
    let t=document.createElement("th");
    let text=document.createTextNode(`YEAR ${i}`);
    t.appendChild(text);
    head.appendChild(t);

}
 t=document.createElement("th");
  text=document.createTextNode(`CURRENT YEAR`);
t.appendChild(text);
head.appendChild(t);


let body=document.getElementById("body");
    

const newArr=arr.map((cval)=>{
    let r=document.createElement("tr");
    let c=document.createElement("td");
    text=document.createTextNode(`${cval.roll}`)
    c.appendChild(text);
    r.appendChild(c);

     c=document.createElement("td");
    text=document.createTextNode(`${cval.reg}`)
    c.appendChild(text);
    r.appendChild(c);

     c=document.createElement("td");
    text=document.createTextNode(`${cval.year}`)
    c.appendChild(text);
    r.appendChild(c);
    let j=1;
    for( j=1;j<year;j++)
    {
        let t=document.createElement("td");
        let text=document.createTextNode(`${cval.marks[j-1].mr}`);
        t.appendChild(text);
        r.appendChild(t);

    }

     c=document.createElement("td");

    let f=document.createElement("form");
    f.action="/update";
    f.method="post";


    // c=document.createElement("td");
    let i=document.createElement("input");
    i.type="number";
    i.min="0";
    i.max="100";
    i.value=`${cval.marks[j-1].mr}`;
    i.step="1";
    i.required="true";
    i.name="marks";

    
     f.appendChild(i);
    // c.appendChild(i);
    // f.appendChild(c);
    
    let i1=document.createElement("input");
    i1.type="hidden";
    i1.name="email";
    i1.value=`${cval.email}`;

    
    let i2=document.createElement("input");
    i2.type="hidden";
    i2.name="year";
    i2.value=`${year}`;

    // console.log(i2.value)

    f.appendChild(i1);
f.appendChild(i2);
//  c=document.createElement("td");
let i3=document.createElement("input");
i3.type="submit";
i3.value="save";
f.appendChild(i3);

let i4=document.createElement("input");
    i4.type="hidden";
    i4.name="dept";
    i4.value=`${dept}`;


    let i5=document.createElement("input");
    i5.type="hidden";
    i5.name="course";
    i5.value=`${course}`;
    f.appendChild(i4);
    f.appendChild(i5);



 c.appendChild(f);

    // r.appendChild(f);
//    c1.appendChild(f);
   r.appendChild(c);


    body.append(r);
    


})