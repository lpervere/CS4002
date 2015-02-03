//Packaage used in the NetBeans environment
package lab2;

//The libraries imported that are needed for the program to run
import java.io.BufferedReader;      //Buffered reader - loads the whole input file into the program buffer
import java.io.FileReader;          //Access the file on the disk through a directory as a string argument
import java.io.IOException;         //If there is a problem with input or output, this will be thrown and dealth with
import java.io.InputStreamReader;   //Read the input from the console - needed to specify the file location
import java.io.PrintWriter;         //Print contents to a file - string printer, not byte by byte (not treated as binary data)
//The actual program
public class Lab {
    //The main method - where the program run starts
    //Again, as mentioned above, this method accepts input and gives off output - so throws IOEXception is needed
    public static void main(String[] args) throws IOException {
        //The current line in the file - needed for tokenization
        String currentLine;
        //The reader that will load everything into the buffer
        BufferedReader br;
        //The file printer - the file will be called properData.csv in the directory of the running program
        PrintWriter out = new PrintWriter("properData.csv");
        //Headers that will be put at the very top of the CSV file - this is the very first line
        String[] headers = {"animal name","hair","feathers","eggs","milk",
            "airborne","aquatic","predator","toothed","backbone","breathes",
            "venomous","fins","legs","tail","domestic","catsize","type"};
        //Types of data that are present in the input file
        //Other   --> Refers to the name, first column, leaves it as it is
        //Boolean --> Refers to most of the columns, will change a 0 to false and 1 to true
        //Numeric --> Refers to the last column, will keep the data and just write it to the output file
        String[] dataTypes = {"Other","Boolean","Boolean","Boolean","Boolean",
            "Boolean","Boolean","Boolean","Boolean","Boolean","Boolean","Boolean",
            "Boolean","Numeric","Boolean","Boolean","Boolean","Numeric"};
        //Since strings are immutable in Java, I used a StringBuilder class in order to create the header for the CSV file
        StringBuilder headerString = new StringBuilder();
        //Console prompt to put the file directory
        //Windows --> C:\zoo.data
        //OS X    --> /Users/Ivan/zoo.data
        System.out.print("Please enter full path to unprocessed file: ");
        //Bind the buffered reader to System.in, which is the console input
        BufferedReader fileLocation = new BufferedReader(new InputStreamReader(System.in));
        //Get the filename from console
        String fileName = fileLocation.readLine();
        //The core of the program
        try {
            //Iterate through each header string
            for(String s : headers) {
                //Put a comma after each one but the last one
                if(headerString.length() != 0) {
                    headerString.append(",");
                }
                //Append current column header to string builder header
                headerString.append(s);
            }
            //Write that to the file - first line
            out.println(headerString);
            //Bind the bufferedReader to the given filename and input
            br = new BufferedReader(new FileReader(fileName));
            //As long as you are not at the end of the file, process the line
            while((currentLine = br.readLine()) != null) {
                //Tokenize the string, splitting it up by commas
                //This will store each part in an array
                String[] toProcess = currentLine.split(",");
                                //My God-awful loop
                                //Iterate through the dataTypes array, since that is the master column indicator
                                for(int i=0;i<dataTypes.length;i++) {
                                    //Depending on the type of data, the program will change it accordingly
                                    //and write the string to the file
                                        switch(dataTypes[i]) {
                                            //Starting with Java 7, you can use strings in the switch statement
                                            //This is the case of the name - so other type of data
                                            case "Other":
                                                //Simply write it to the file
                                                out.print(toProcess[i]+",");
                                                break;
                                            //Case of boolean
                                            case "Boolean":
                                                //Turn it to false if the value is 0
                                                if("0".equals(toProcess[i])) {
                                                    out.print("false"+",");
                                                //Otherwise it is true
                                                } else {
                                                    out.print("true"+",");
                                                }
                                                break;
                                            //Final column, case is numeric
                                            case "Numeric":
                                                //If the item is the end, add a newline as well
                                                if(i==dataTypes.length-1) {
                                                    out.println(toProcess[i]);
                                                } else {
                                                //Otherwise, simply write it to file
                                                out.print(toProcess[i]+",");    
                                                }
                                                break;
                                        }
                                }
                        //Finish the file write procedure at the end
            }
        out.close();            
        //If anything goes wrong, primarily with input or output
        //This will print out the stack trace to see where the exception happened
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}