<div class="row" style="margin-bottom: 10px">
  <div class="col-xs-12 col-md-5">
    <h2><?= $result->name ?></h2>
    <p><?= $result->description ?></p>
  </div>
  <div class="col-xs-12 col-md-6 col-md-offset-1">
    <div id="kaltura_player_<?= $result->id ?>" style="width: 560px; height: 395px;">
      <script src="https://cdnapisec.kaltura.com/p/<?= $result->partnerId ?>/sp/<?= $result->partnerId ?>00/embedIframeJs/uiconf_id/27723522/partner_id/<?= $result->partnerId ?>?autoembed=true&entry_id=<?= $result->id ?>&playerId=kaltura_player_<?= $result->id ?>&cache_st=1435602081&width=560&height=395">
      </script>
    </div>
  </div>
</div>
