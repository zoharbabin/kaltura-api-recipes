// check whether this entry already has quiz object
$filter = new KalturaQuizFilter();
$filter->entryIdEqual = $entryId;
$pager = null;
$quizPlugin = KalturaQuizClientPlugin::get($client);
$result = $quizPlugin->quiz->listAction($filter, $pager);
// if it does not, create one
if (count($result->objects) === 0 ){
        $quiz = new KalturaQuiz();
        $quiz->uiAttributes = array();
        $quiz->uiAttributes[0] = new KalturaKeyValue();
        $quiz->uiAttributes[0]->key="WelcomeMessage";
        $quiz->uiAttributes[0]->value="Mashu nu";

        $quiz->uiAttributes[1] = new KalturaKeyValue();
        $quiz->uiAttributes[1]->key="inVideoTip";
        $quiz->uiAttributes[1]->value="true";

        $quiz->uiAttributes[2] = new KalturaKeyValue();
        $quiz->uiAttributes[2]->key="canSkip";
        $quiz->uiAttributes[2]->value="true";
        $result = $quizPlugin->quiz->add($entryId, $quiz);
}

$cuePoint = new KalturaQuestionCuePoint; 
$cuePoint->question = $_POST["question"];
$cuePoint->optionalAnswers = null;
$cuePoint->startTime = $_POST["startTime"];
$cuePoint->entryId = <%- Lucy.code.variable('answers.entryIdEqual') %>;
$result = $client->cuePoint->add($cuePoint);
<%- Lucy.returnCode('$result') %>
