# Run this file with Python version 3.x

import codecs
from os.path import splitext



def getData(file):
    """ Return a collection of the lines"""
    
    with file:
        read_data = file.readlines()
    if not file.closed:
        file.close()
        
    for i in range(0, len(read_data)):
        read_data[i] = read_data[i].strip()
    return read_data


def parseItems(data):
    """ For each string, get a tuple with the three parts (number, string, index)
        split up. Assume all digits at the front of a line, including up to
        one decimal and ignoring commas, are considered one 'number' """
    
    parsed_data = []
    index = 0
    
    for item in data:
        number, string = parseItem(item)
        
        parsed_data.append((number, string, index)) # Keep index to quickly access the original file contents
        index += 1
    return parsed_data


def parseItem(item):
    """ Parse a single item (string) into number and string parts"""
    
    if len(item) == 0:   
        return (0, "")

    valid_chars = "0123456789 ,."
    num_end = 0
                                                    
    if item.strip()[0] in ["-", "+"]:               # Move past a leading '-' or '+'
        num_end = item.find(item.strip()[0]) + 1
                                                    # Get all leading digits, spaces, commas, or decimals (up to second decimal)
    while (num_end < len(item)) and (item[num_end] in valid_chars):
        if (item[num_end] == "."):
            valid_chars = "0123456789 ,"            # Exclude decimal from valid characters once we've hit one
        num_end += 1
                                                    # Convert the numerical part into a float
    number_slice = item[0:num_end].replace(" ", "").replace(",", "")
    if number_slice.replace("-", "").replace("+", "") in ["", "."]:
        number = 0
    else:
        number = float(number_slice)
                                                    # Get the rest of the string (lower() for case-insensitive sorting)
    string_slice = item[num_end:].strip().lower()
    return (number, string_slice)


def bar(title_string):                              # This is just for pretty console printing
    
    right = 45 - len(title_string)
    if right < 0:
        right = 0
    return "=" * 15 + " " + title_string + " " + "=" * right


class Runner(object):                                       # Main loop runner. Functional parameters are for "headless" testing,
    def __init__(self, prompt= input, print_fn= print):     # that is, they can be replaced with dummy test functions;
        self.prompt = prompt                                # there's probably an easier builtin way to do that.
        self.print_fn = print_fn

        
    def run(self):
        file_opened = False
        output_opened = False

        self.print_fn(bar("INPUT FILE SELECTION"))          # Get input file from user
        while not file_opened:                          
            path = self.prompt("Please enter absolute directory for flat file\n>> ")
            try:
                file = codecs.open(path, "r", "utf-8")
                
                file_opened = True
                self.print_fn(bar("FILE OPENED: " + path))
            except IOError:
                self.print_fn("Error reading file: " + path + "\n")
        
        output_path = splitext(path)[0] + "_SORTED.txt"
        
        data = getData(file)                                # Get data collection
        data_parsed = parseItems(data)                      # Parse it into parts
        
        # Sort the data based on tuple-sorting - first by the number ([0]) then by the word ([1])
        data_sorted = sorted(data_parsed, key=lambda item: (item[0], item[1]))

        while not output_opened:                            # If default "..._SORTED" file can't be opened, prompt for another
            try:                                       
                output_file = codecs.open(output_path, "w", "utf-8")
                output_opened = True
            except IOError:
                self.print_fn("Problem opening output file: " + output_path)
                output_path = self.prompt("Please enter different output file path\n>> ")

                                                            # Write the output file, using the sorted tuples' 
        with output_file:                                   # Third item (original index into the input data)
            
            last_index = min((len(data_parsed), len(data))) - 1
            for i in range(0, last_index):
                index = data_sorted[i][2]
                output_file.write(data[index] + "\r\n")
            index = data_sorted[last_index][2]
            output_file.write(data[index])             # The last line doesn't need a newline
            
        if not output_file.closed:
            output_file.close()
            
        self.print_fn(bar("SORTING FINISHED"))
        self.print_fn("Output file can be found at " + output_path)
        self.prompt("")

if __name__ == "__main__":
    MainLoop = Runner()
    MainLoop.run()
