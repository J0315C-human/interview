from mySideWalkQuestion1 import *
import unittest
from os.path import exists as exists
from os import getcwd, sep

def t_prompt(dummy):
    return getcwd() + sep + "test_file.txt"

def t_print_fn(dummy):
    return

rawdata = ["45fin", "+35,.Bla", "FN", "%$#%", "-0-0-0",
        ",5,4 dem", "3.2 gop", "", "444444.003 NNN",
        "9b", "9AB", "9AC", "9C", "9A"]
parsed = [(45.0, 'fin', 0), (35.0, 'bla', 1),
            (0, 'fn', 2), (0, '%$#%', 3), (-0.0, '-0-0', 4),
            (54.0, 'dem', 5), (3.2, 'gop', 6), (0, '', 7),
            (444444.003, 'nnn', 8), (9.0, 'b', 9),
            (9.0, 'ab', 10), (9.0, 'ac', 11),
            (9.0, 'c', 12), (9.0, 'a', 13)]
dsorted = ["%$#%", "-0-0-0", "FN", "3.2 gop",
           "9A", "9AB", "9AC", "9b", "9C", "+35,.Bla",
           "45fin", ",5,4 dem", "444444.003 NNN"]

class TestParsing(unittest.TestCase):


    def test_normal(self):
        data = "333 normalItem"
        self.assertEqual(parseItem(data), (333.0, "normalitem"))
        
    def test_spaces(self):
        data = " 3 3 3 Name Name"
        self.assertEqual(parseItem(data), (333.0, "name name"))
        
    def test_decimalAndLeadingZero(self):
        data = "001.200 Name"
        self.assertEqual(parseItem(data), (1.2, "name"))

    def test_invalidDecimals(self):
        data = "192.168.0.1"
        self.assertEqual(parseItem(data), (192.168, ".0.1"))

    def test_commas(self):
        data = "2,33,4 dinner"
        self.assertEqual(parseItem(data), (2334, "dinner"))

    def test_Negativesign(self):
        data = "-8 A"
        self.assertEqual(parseItem(data), (-8.0, "a"))

    def test_Positivesign(self):
        data = "+8 A"
        self.assertEqual(parseItem(data), (8.0, "a"))
        
    def test_ParseItems(self):
        data = ["1 apple", "1 banana"]
        expected = [(1.0, 'apple', 0), (1.0, 'banana', 1)]
        self.assertEqual(parseItems(data), expected)

    def test_ParseItems(self):

        self.assertEqual(parseItems(rawdata), parsed)

    def test_Output(self):
        
        input_path = getcwd() + sep + "test_file.txt"
        output_path = getcwd() + sep + "test_file_SORTED.txt"
        print(output_path)
        
        test_file = codecs.open(input_path, "w", "utf-8")
        for i in range(len(rawdata)-1):
            test_file.write(rawdata[i] + "\r\n")
        test_file.write(rawdata[i+1])
        MainLoop = Runner(t_prompt, t_print_fn)
        MainLoop.run() #why the fuck isn't this working within the test run?
        #the output file should exist now
        self.assertEqual(exists(output_path), True)
        


if __name__ == '__main__':
    unittest.main()
    
