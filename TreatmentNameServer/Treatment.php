<?php
    
    class Trie {
        
        private $trie;
        
        public function __construct() {
            $this->trie = array('children' => array());
        }
        
        public function add($key, $value = null) {
            $trieLevel =& $this->getTrieForKey($key, true);
            $trieLevel['value'] = $value;
        }
        
        public function isMember($key) {
            $trieLevel = $this->getTrieForKey($key);
            if($trieLevel != false && array_key_exists('value', $trieLevel)) {
                return true;
            }
            return false;
        }
        
        public function prefixSearch($prefix) {
            $trieLevel = $this->getTrieForKey($prefix);
            if(false == $trieLevel) {
                return false;
            } else {
                return $this->getAllChildren($trieLevel, $prefix);
            }
        }
        
        private function& getTrieForKey($key, $create = false) {
            $trieLevel =& $this->trie;
            for($i = 0; $i < strlen($key); $i++) {
                $character = $key[$i];
                if(!isset($trieLevel['children'][$character])) {
                    if($create) {
                        $trieLevel['children'][$character] =
                        array('children' => array());
                    } else {
                        return false;
                    }
                }
                $trieLevel =& $trieLevel['children'][$character];
            }
            
            return $trieLevel;
        }
        
        private function getAllChildren($trieLevel, $prefix) {
            $return = array();
            if(array_key_exists('value', $trieLevel)) {
                $return[$prefix] = $trieLevel['value'];
            }
            
            if(isset($trieLevel['children'])) {
                foreach($trieLevel['children'] as $character => $trie) {
                    $return = array_merge($return,
                                          $this->getAllChildren($trie, $prefix . $character));
                }
            }
            return $return;
        }
        
    }
    
    $trie = new Trie();
    //build DS from file
    $file = fopen("data.txt","r");
    while(!feof($file)) {
        
        fseek($file,5,SEEK_CUR);
        $name = fgets($file);
        $name = trim(strtolower($name));
        $trie->add($name);
    }
    fclose($file);
    
    //
    
    //set the search parameter
    if (isset($argv))
        $search = $argv[1];
    else
        $search = $_GET['search'];
    $search = trim(strtolower($search));
    //search in Trie
    $result = $trie->prefixSearch((string)$search);
    //var_dump($result);
    //return result
    //$result = var_dump($result);
    $response = array();
    if($result != FALSE){
    while ( ($name = current($result)) !== FALSE ) {
        array_push($response,key($result));
        next($result);
    }}
    
    echo json_encode($response);
?>