
function draw_table() { //Function that "draws" our text table into the index page. 
	$("#results").empty(); //Initializes the result that is empty for the time being. 
	$.getJSONuncached = function (url) 
	{
		return $.ajax( 
		{
			url: url, //url that corresponds to our webside's one.
			type: 'GET', //the get method to obtain the text table.
			cache: false,
			success: function (html)
			{ 
				$("#results").append(html); //the html is appended to the result var.
				select_row();
			}
		});
	};
	$.getJSONuncached("/get/html")
};

function select_row() //Function in order to select a specific row out of the table.
{
	$("#recordsTable tbody tr[id]").click(function () { //Function that takes the row from the table body.
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
		var section = $(this).prevAll("tr").children("td[colspan='3']").length - 1;  
		var entree = $(this).attr("id") - 1;
		delete_row(section, entree); //Calling of the delete row function an passing the section and entree as argument.
	})
};

function delete_row(sec, ent)
{
	$("#delete").click(function ()
	{
		$.ajax(
		{
			url: "/post/delete",
			type: "POST",
			data:
			{
				section: sec,
				entree: ent
			},
			cache: false,
			success: setTimeout(draw_table, 1000)
		})
	})
};

$(document).ready(function () 
{
	draw_table(); //After the process of alter the table it draws it back with the modifications saved.
});