</div> <!-- root -->

<?php wp_footer();?>

<script>

		function submit (values) {
			console.log(values)
		}

		drag({
			// 指定渲染节点
			id: 'root',
			items: [
				{
					objectId: '123',
					text: 'haha1'
				},
				{
					objectId: '124',
					text: 'haha2'
				},
				{
					objectId: '125',
					text: 'haha3'
				}
            ],
            selected: [
				{
                    objectId: '123',
                    extra: [
                        {
                            key: '自定义key',
                            value: '自定义value'
                        }
                    ]
				},
				{
					objectId: '124'
				},
				{
					objectId: '125'
				}
            ],
			submit
		})
	</script>


</body>
</html>
