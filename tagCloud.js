 /****************************
  Break string of text into array of words and 
  strip out all punctuation

  Create hash of unique words with frequency count
*****************************/
var wordCount = function(copy) {
  var cleanCopy = copy.toLowerCase().replace(/[,.!:;]/g, "");
  var wordArray = cleanCopy.split(" ");
  console.dir(wordArray);
	var wordCounts = {};
	for(var i = 0; i< wordArray.length; i++) {
    var num = wordArray[i];
    wordCounts[num] = wordCounts[num] ? wordCounts[num]+1 : 1;
  }
  return wordCounts;
};


