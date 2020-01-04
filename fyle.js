var alldata;
var selected_page;
var no_of_pages;
var newdata;
function getdata(city)
		{
		document.getElementById("searchbox").value="";
		var y= document.getElementById("loader");
		var x= document.getElementById("data");
		x.style.display="none";
		y.style.display="block";
		var count=document.getElementById('count').value;
		url="https://vast-shore-74260.herokuapp.com/banks?city="+city;
		document.getElementById("bankdata").children[0]=null;
		fetch(url) 
			.then((resp) => resp.json())
			.then(function(data) {		
				alldata=data;
				newdata=data;	 
				x.style.display="block"; 
				y.style.display="none";  
			    selectpage(1);
			})
			.catch(function(error) {
			    console.log("error:"+error)
			});
		}
function displaydata(flag)
{	
	var count=document.getElementById('count').value;
	document.getElementById("bankdata").innerHTML=`<tr>
				<th class=fav>Favourite</th>
				<th>IFSC</th>
				<th>BANK NAME</th>
				<th>BRANCH</th>
				<th>ADDRESS</th>
			</tr>`;
	if(newdata.length==0){
		document.getElementById("bankdata").innerHTML="<p>Sorry, no results found</p>";
		document.getElementById("selectpage").style.display="none";
	}
	else document.getElementById("selectpage").style.display="block";
	if(flag)selectpage(1);
	else{
	for(var i=(selected_page-1)*count;i<Math.min(selected_page*count,newdata.length);i++) 
	    {
	    	var tr=document.createElement("tr");
	    	var td0=document.createElement("td");
	    	var td1=document.createElement("td");
	    	var td2=document.createElement("td");
	    	var td3=document.createElement("td");
	    	var td4=document.createElement("td");
	    		td0.innerHTML="<img class=heart src='png/001-heart.png'>";
	    		td0.setAttribute("class","fav");
	    		td0.setAttribute("onclick","updatefav("+"'"+newdata[i].ifsc+"'"+")");
	    		if(checkfav(newdata[i].ifsc))
	    		{
	    			td0.innerHTML="<img class=heart src='png/002-heart-1.png'>";
	    		}
	    		tr.appendChild(td0);
	    		td1.innerHTML=newdata[i].ifsc;
	    		tr.appendChild(td1);
	    		td2.innerHTML=newdata[i].bank_name;
	    		tr.appendChild(td2);
	    		td3.innerHTML=newdata[i].branch;
	    		tr.appendChild(td3);
	    		td4.innerHTML=newdata[i].address;
	    		tr.appendChild(td4); 
	    	document.getElementById("bankdata").appendChild(tr);
	    }
	}
}

function displaypages(count)
{
	if(typeof(count)=="object")
	count=Number(count.value)
	if(typeof(count)=="string")
	count=Number(count)
	no_of_pages = Math.ceil(newdata.length/count);
	document.getElementById("pages").innerHTML="";
	var firstpage = Math.max(1,selected_page-4);
	firstpage = Math.min(firstpage,no_of_pages-9)
	if(firstpage<1)firstpage=1;
	var lastpage = Math.min(firstpage+9,no_of_pages);
	for(var i=firstpage;i<=lastpage;i++)
	{
		var page = document.createElement("a");
		page.setAttribute("class","pageno noselect");
		page.innerHTML=i;
		page.setAttribute("onclick","selectpage("+i+")"); 
		document.getElementById("pages").appendChild(page);
	}
	displaydata(0);
}
function selectpage(page)
{
	if(!page)page=1;
	selected_page=page;
	displaypages(count);
	var x=Number(document.getElementById("pages").children[0].innerHTML);
	document.getElementById("pages").children[page-x].id="selected";
}
function nextpage()
{
	if(selected_page<no_of_pages)
	selectpage(++selected_page);
}
function prevpage()
{
	if(selected_page>1)
	selectpage(--selected_page);
}
function search(value)
{
	newdata = alldata.filter(function(b){
	return ((b.bank_name).toLowerCase().includes(value.toLowerCase())||(b.address).toLowerCase().includes(value.toLowerCase())||(b.branch).toLowerCase().includes(value.toLowerCase())||(b.ifsc).toLowerCase().includes(value.toLowerCase()));
	},value)
	displaypages(document.getElementById("count").value);
	selectpage(1);
}
function checkfav(favifsc)
{
	if(window.localStorage.getItem(favifsc))
	{
		return 1;
	}
	return 0;
}
function updatefav(favifsc)
{
	if(window.localStorage.getItem(favifsc))
	{
		window.localStorage.removeItem(favifsc);
	}
	else
	{
		window.localStorage.setItem(favifsc,1);
	}
	displaydata(0);
}