function randomArray(max, length) {
  if (length === undefined) length = 10; // hack because this is running ES5
  return Array.apply(null, Array(length)).map(function() {
      return Math.round(Math.random() * (max-1)); //subtract 1 because of 0 indexing
  });
} // end function randomArray

var YEARS = ["2012", "2013", "2014", "2015", "2016", "2017", "2018"];

function wayback() {

  var year = YEARS[randomArray(YEARS.length,1)[0]];
  
  // the search string for the 
  var search_string = "label:_inbox-old-" + year;

  // console.log(search_string);
  
  // get threads from label as a GmailThreads[] object
  var threads = GmailApp.search(search_string,0,500)

  // get array of 10 random numbers to use as index
  random_index = randomArray(threads.length)

  // iterate through the array of random numbers
  for (var i = 0; i < random_index.length; i++) {

    // move the thread to inbox referenced in the random array
    threads[random_index[i]].moveToInbox();

  } // end for

  
} // end function wayback()