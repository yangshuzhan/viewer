let script='It is Peppa’s birthday. It is very early in the morning. It’s my birthday. George, wake up. It’s my birthday. I’m going to have a party, and Daddy is doing a magic show. Quick, George. Let’s wake Mummy and Daddy up. Mummy Pig and Daddy Pig are still falling asleep. Wake up, it’s my birthday! Wake up! What time is it? It’s very late. It’s five o’clock in the morning. Yes, the whole day is going. Okay, let’s get your birthday started.'
let words=[],sentance=[];
let tags=['n', 'v', 'n', 'v', 'n', '.' ,'n', 'v', 'm', 'm', 'm', 'm', 'n', '.' , 'n', 'v', 'm', 'n','.', 'n','.', 'v', 'm','.', 'n', 'v', 'm', 'n', '.', 'n', 'v', 'v', 'm', 'v', 'm', 'n', '.', 'm', 'n', 'v', 'v', 'm', 'm', 'n','.',  'm', '.', 'n','.',  'v', 'n', 'v', 'n', 'm', 'n', 'm', '.', 'n', 'n', 'm', 'n', 'n', 'v', 'm', 'v', 'm', '.', 'v', 'm', '.', 'n', 'v', 'm', 'n', '.', 'v', 'm', '.', 'n', 'n', 'v', 'n', '.', 'n', 'v', 'm', 'm', '.', 'n', 'v', 'm', 'n', 'n', 'm', 'm', 'n', '.', 'n', '.', 'm', 'm', 'n', 'v', 'v', '.', 'n', '.', 'v', 'n', 'v', 'm', 'n', 'v','.',]
let dict=dictionary();
pickSentence();
pickWords();
console.log(words[60],tags[60])
function pickSentence(){
  let reg = new RegExp('(.+)\.','gi');
  console.log(reg)
  sentence=script.split('.');
  //console.log(sentence)
}
function pickWords(){
  script=script.replace(/\.|,|\?|!/g,' .')
  console.log(script)
  let reg = new RegExp('(\\w+|\.)(\\W|$)','gi');
  console.log(reg)
  script.replace(reg,pushin);
  function pushin(str,p1){
    words.push(p1.toLowerCase());
  }
}
let transitionmatrix=new Array(9);
transitionmatrix.fill(0);
for(let i=0;i<tags.length-1;i++){
  if(tags[i]=='n'){
    if(tags[i+1]=='n')
      transitionmatrix[0]++;
    else if(tags[i+1]=='v')
      transitionmatrix[1]++;
    else if(tags[i+1]=='m')
      transitionmatrix[2]++;
  }
  else if(tags[i]=='v'){
    if(tags[i+1]=='n')
      transitionmatrix[3]++;
    else if(tags[i+1]=='v')
      transitionmatrix[4]++;
    else if(tags[i+1]=='m')
      transitionmatrix[5]++;
  }
  else if(tags[i]=='m'){
    if(tags[i+1]=='n')
      transitionmatrix[6]++;
    else if(tags[i+1]=='v')
      transitionmatrix[7]++;
    else if(tags[i+1]=='m')
      transitionmatrix[8]++;
  }
}
for (let j = 0; j < 9; j+=3) {
  let a = transitionmatrix[j] + transitionmatrix[j+1] + transitionmatrix[j+2];
  for (let i = 0; i < 3; i++) {
    transitionmatrix[j+i] /= a;
  }
}

console.log(transitionmatrix);
train()
function predict(str){
  if(str=='n'){
    return 'v'
  }
  else if(str=='v'){
    return 'm'
  }
  else return 'n'
}
function predict2(pre,next){
  let arr=[1,1,0],arr2=[1,1,1];
  if(pre=='n')
    arr=transitionmatrix.slice(0,3);
  else if(pre=='v')
    arr=transitionmatrix.slice(3,6);
  else if(pre=='m')
    arr=transitionmatrix.slice(6,9);
  
  
  if(next=='n')
    arr2=[transitionmatrix[0],transitionmatrix[3],transitionmatrix[6]];
  else if(next=='v')
    arr2=[transitionmatrix[2],transitionmatrix[4],transitionmatrix[7]];
  else if(next=='m')
    arr2=[transitionmatrix[3],transitionmatrix[5],transitionmatrix[8]];
  
  arr=[arr[0]*arr2[0],arr[1]*arr2[1],arr[2]*arr2[2]];
  let p=arr.indexOf(max(arr));
  if(p==0)
    return 'n'
  else if(p==1)
    return 'v'
  else return 'm'
}
function predict3(pre,current,next){
  let temp=dict(current)
  if(temp!=null)
    return temp;
  
  let arr=[1,1,0],arr2=[1,1,1];
  if(pre=='n')
    arr=transitionmatrix.slice(0,3);
  else if(pre=='v')
    arr=transitionmatrix.slice(3,6);
  else if(pre=='m')
    arr=transitionmatrix.slice(6,9);
  
  
  if(next=='n')
    arr2=[transitionmatrix[0],transitionmatrix[3],transitionmatrix[6]];
  else if(next=='v')
    arr2=[transitionmatrix[2],transitionmatrix[4],transitionmatrix[7]];
  else if(next=='m')
    arr2=[transitionmatrix[3],transitionmatrix[5],transitionmatrix[8]];
  
  arr=[arr[0]*arr2[0],arr[1]*arr2[1],arr[2]*arr2[2]];
  let p=arr.indexOf(max(arr));
  if(p==0)
    return 'n'
  else if(p==1)
    return 'v'
  else return 'm'
}
function train(){
  let wrong=0,j=0;
  for(let i=0;i<tags.length;i++){
    if(tags[i]=='.')
      continue
    if(tags[i]!=predict3(tags[i-1],words[i],tags[i+1])){
      console.log(words[i])
      wrong++;
    }
    
    j++;
  }
  console.log(tags)
  console.log(wrong/j);
}
function max(arr){
  let temp=-Infinity;
  for(let i=0;i<arr.length;i++){
    if(arr[i]>temp)
      temp=arr[i]
  }
  return temp;
}
function maxi(arr){
  let temp=-Infinity,index=0;
  for(let i=0;i<arr.length;i++){
    if(arr[i]>temp){
      temp=arr[i];
      index=i
    }   
  }
  return index;
}
function dictionary(){
  let data=[['it',1,0,0],['is',0,1,0],['peppa',1,0,0],['s',0.22,0.67,0.11],['birthday',1,0,0],['very',0,0,1],['early',0,0,1],['in',0,0,1],['the',0,0,1],['morning',1,0,0],['my',0,0,1],['george',1,0,0],['wake',0,1,0],['up',0,0,1],['m',0,1,0],['going',0,1,0],['to',0,0,1],['have',0,1,0],['a',0,0,1],['and',0,0,1],['party',1,0,0],['daddy',1,0,0],['mummy',1,0,0],['let',0,1,0],['pig',1,0,0],['day',1,0,0],['asleep',0,0,1],['get',0,1,0],['started',0,1,0],['yes',1,0,0],['okay',1,0,0],['doing',0,1,0],['quick',0,0,1],['falling',0,1,0],['time',1,0,0],['late',0,0,1],['clock',1,0,0],['what',1,0,0],['o',1,0,0]];
  function lookup(word){
    for(let i=0;i<data.length;i++){
      if(data[i][0]==word){//词典中找到
        let index=maxi(data[i])
        if(index==1)
          return 'n'
        else if(index==2)
          return 'v'
        else if(index==3)
          return 'm'
      }
    }
    return null;
  }
  return lookup;
}