class App
{

	constructor()
	{
		let canvas;
		let canvas_ctx;
		let viewport_width;
		let viewport_height;
		let bounds;
		let top_bound;
		let floor;
		let shapes;
		let allow_link_opening;
		let viewport_width_breakpoint;
		let state;

		const Engine = Matter.Engine;
		const Render = Matter.Render;
		const Runner = Matter.Runner;
		const Body = Matter.Body;
		const Composites = Matter.Composites;
		const Common = Matter.Common;
		const MouseConstraint = Matter.MouseConstraint;
		const Mouse = Matter.Mouse;
		const Composite = Matter.Composite;
		const Bodies = Matter.Bodies;
		const Query = Matter.Query;

		const SHAPES_SCALING = [
			[0, 1],
			[360, 1.5],
			[720, 2.5],
			[1024, 3.5],
			[1440, 5]
		];

		const LINK_OPENING_DELAY = 1000;
		const CLICK_MOVEMENT_THRESHOLD = 3;

		const ROTATE_DOT = false;

		const DEFAULT_STATE = 1;
		const DESTROYING_STATE = 2;

		let engine = Engine.create();

		let world = engine.world;

		Common.setDecomp(window.decomp);

		let app_cont = document.querySelector("#app");

		canvas = app_cont.querySelector("#canvas");
		canvas_ctx = canvas.getContext("2d");

		viewport_width = app_cont.clientWidth;
		viewport_height = app_cont.clientHeight;

		canvas.width = viewport_width;
		canvas.height = viewport_height;

		/*let render = Render.create({
			element: app_cont,
			engine: engine,
			options: {
				width: viewport_width,
				height: viewport_height,
				showAngleIndicator: false,
				hasBounds: true,
				wireframes: true,
				background: "rgba(0, 0, 0, 1)"
			}
		});

		Render.run(render);*/

		let runner = Runner.create();

		Runner.run(runner, engine);

		state = DEFAULT_STATE;

		makeWorldBounds();

		shapes = [];

		let shape_options = { friction: 0.9, render: { fillStyle: "gray" } };

		let shape_01 = Bodies.fromVertices(viewport_width / 2,viewport_height / 2, [
			{ x: 0, y: 0 },
			{ x: 0, y: -62 },
			{ x: 30, y: -62 },
			{ x: 30, y: -31 },
			{ x: 62, y: -31 },
			{ x: 62, y: 0 }
		], shape_options);
		shape_01.div = app_cont.querySelector("#shape_01");
		shape_01.div.rotate = true;
		shapes.push(shape_01);
		Composite.add(world, shape_01);

		let shape_02 = Bodies.fromVertices(viewport_width / 2,viewport_height / 2, [
			{ x: 19.5, y: 0 },
			{ x: 0, y: -46 },
			{ x: 36, y: -85 },
			{ x: 87, y: -59 },
			{ x: 77, y: -46 },
			{ x: 82, y: -30 },
			{ x: 62.5, y: 0 }
		], shape_options);
		shape_02.div = app_cont.querySelector("#shape_02");
		shape_02.div.rotate = true;
		shapes.push(shape_02);
		Composite.add(world, shape_02);

		let shape_03 = Bodies.circle(viewport_width / 2, viewport_height / 2, 30, shape_options, 40);
		shape_03.div = app_cont.querySelector("#shape_03");
		shape_03.div.rotate = true;
		shapes.push(shape_03);
		Composite.add(world, shape_03);

		let shape_04 = Bodies.rectangle(viewport_width / 2, viewport_height / 2, 108, 54, Object.assign({ chamfer: { radius: [0, 0, 53.5, 53.5], qualityMin: 16 } }, shape_options));
		shape_04.radius = (shape_04.bounds.max.x - shape_04.bounds.min.x) / 2;
		shape_04.div = app_cont.querySelector("#shape_04");
		shape_04.div.rotate = true;
		shapes.push(shape_04);
		Composite.add(world, shape_04);

		let shape_05 = Bodies.rectangle(viewport_width / 2, viewport_height / 2, 90, 37, shape_options);
		shape_05.width = shape_04.bounds.max.x - shape_04.bounds.min.x;
		shape_05.height = shape_04.bounds.max.y - shape_04.bounds.min.y;
		shape_05.div = app_cont.querySelector("#shape_05");
		shape_05.div.rotate = true;
		shapes.push(shape_05);
		Composite.add(world, shape_05);

		let shape_06 = Bodies.rectangle(viewport_width / 2, viewport_height / 2, 54, 40, Object.assign({ chamfer: { radius: 19.5, qualityMin: 10 } }, shape_options));
		shape_06.width = shape_06.bounds.max.x - shape_06.bounds.min.x;
		shape_06.height = shape_06.bounds.max.y - shape_06.bounds.min.y;
		shape_06.chamfer_radius = shape_06.height / 2;
		shape_06.div = app_cont.querySelector("#shape_06");
		shape_06.div.rotate = true;
		shapes.push(shape_06);
		Composite.add(world, shape_06);

		let dots_cont = app_cont.querySelector("#dots_cont");

		let dot_01 = Bodies.circle(viewport_width / 2, viewport_height / 2, 7.5, shape_options, 20);
		dot_01.div = dots_cont.querySelector("#dot_01");
		dot_01.div.rotate = ROTATE_DOT;
		shapes.push(dot_01);
		Composite.add(world, dot_01);

		let dot_02 = Bodies.circle(viewport_width / 2, viewport_height / 2, 7.5, shape_options, 20);
		dot_02.div = dots_cont.querySelector("#dot_02");
		dot_02.div.rotate = ROTATE_DOT;
		shapes.push(dot_02);
		Composite.add(world, dot_02);

		let dot_03 = Bodies.circle(viewport_width / 2, viewport_height / 2, 7.5, shape_options, 20);
		dot_03.div = dots_cont.querySelector("#dot_03");
		dot_03.div.rotate = ROTATE_DOT;
		shapes.push(dot_03);
		Composite.add(world, dot_03);

		let dot_04 = Bodies.circle(viewport_width / 2, viewport_height / 2, 7.5, shape_options, 20);
		dot_04.div = dots_cont.querySelector("#dot_04");
		dot_04.div.rotate = ROTATE_DOT;
		shapes.push(dot_04);
		Composite.add(world, dot_04);

		shapes.sort(() => Math.random() - 0.5);

		scaleShapes();
		arrangeShapesOnGrid();

		//let mouse = Mouse.create(render.canvas);
		let mouse = Mouse.create(canvas);
		let mouse_constraint = MouseConstraint.create(engine, {
			mouse: mouse,
			constraint: {
				stiffness: 1,
				render: {
					visible: false
				}
			}
		});

		Composite.add(world, mouse_constraint);

		//render.mouse = mouse;

		/*Render.lookAt(render, {
			min: { x: 0, y: 0 },
			max: { x: viewport_width, y: viewport_height }
		});*/

		let reload_button = app_cont.querySelector("#reload_button");
		reload_button.disabled = true;

		let destroy_button = app_cont.querySelector("#destroy_button");

		Matter.Events.on(engine, "beforeUpdate", onBeforeUpdate);
		Matter.Events.on(engine, "afterUpdate", restrictShapesPosition);
		Matter.Events.on(mouse_constraint, "mousedown", processMouseInteraction);
		Matter.Events.on(mouse_constraint, "mousemove", processMouseInteraction);
		Matter.Events.on(mouse_constraint, "mouseup", processMouseInteraction);

		//app_cont.addEventListener("touchstart", (e) => e.preventDefault());
		//app_cont.addEventListener("touchmove", (e) => e.preventDefault());

		reload_button.addEventListener("click", reload);
		destroy_button.addEventListener("click", destroy);

		window.addEventListener("resize", updateLayout);

		function processMouseInteraction(event)
		{
			let shape;

			if (event.name == "mousemove" || event.name == "mouseup")
			{
				for (let i = 0; i < shapes.length; i++)
				{
					shape = shapes[i];

					if (shape.div)
					{
						shape.highlighted = false;
						shape.div.classList.remove("linked_div_hover");
					}
				}
			}
			let touched_bodies = Query.point(shapes, event.mouse.position);

			if (touched_bodies.length != 0)
			{
				shape = touched_bodies[0];

				if (event.name == "mousedown")
				{
					allow_link_opening = true;
				}
				else if (event.name == "mousemove")
				{
					if (allow_link_opening && Math.sqrt(Math.pow(event.mouse.mousedownPosition.x - event.mouse.position.x, 2) + Math.pow(event.mouse.mousedownPosition.y - event.mouse.position.y, 2)) > CLICK_MOVEMENT_THRESHOLD)
					{
						allow_link_opening = false;
					}
					shape.highlighted = true;

					if (shape.div)
					{
						shape.div.classList.add("linked_div_hover");
					}
				}
				else	if (event.name == "mouseup")
				{
					if (shape.div)
					{
						let a = shape.div.querySelector("a");

						if (allow_link_opening)
						{
							window.setTimeout(() =>
									{
										shape.isStatic = true;

										Body.setVelocity(shape, { x: 0, y: 0 });
										Body.setAngularVelocity(shape, 0);

										//shape.ignoreGravity = true;

										window.open(a.href, a.target)
									},
							LINK_OPENING_DELAY);
						}
					}
					allow_link_opening = false;
				}
			}
		}

		function onBeforeUpdate(event)
		{
			updateDOMNodes();
			drawShapes();
		}

		function updateDOMNodes(event)
		{
			let shape;

			for (let i = 0; i < shapes.length; i++)
			{
				shape = shapes[i];

				if (shape.div)
				{
					shape.div.style.left = shape.position.x + "px";
					shape.div.style.top = shape.position.y + "px";

					shape.div.style.transform = `translate(-50%, -50%) scale(${shape.scale})`;

					if (shape.div.rotate)
					{
						shape.div.style.transform += ` rotate(${shape.angle * (180 / Math.PI)}deg)`;
					}
				}
			}
		}

		function restrictShapesPosition(event)
		{
			let body;
			let body_bounds_width;
			let body_bounds_height;
			let body_x;
			let body_y;
			let fallen_shapes_amount = 0;

			for (let i = 0; i < shapes.length; i++)
			{
				body = shapes[i];

				body_bounds_width = body.bounds.max.x - body.bounds.min.x;
				body_bounds_height = body.bounds.max.y - body.bounds.min.y;

				body_x = body.position.x;
				body_y = body.position.y;

				if (body.position.x < 0)
				{
					body_x = body_bounds_width / 2 + 1;
				}
				else if (body.position.x > viewport_width)
				{
					body_x = viewport_width - body_bounds_width / 2 - 1;
				}
				if (body.position.y < top_bound)
				{
					body_y = top_bound + body_bounds_height / 2 + 1;
				}
				else if (state != DESTROYING_STATE && body.position.y > viewport_height)
				{
					body_y = viewport_height - body_bounds_height / 2 - 1;
				}
				if (body_x != body.position.x || body_y != body.position.y)
				{
					Body.setPosition(body, { x: body_x, y: body_y });
					/*Body.setAngle(body, 0);
					Body.setVelocity(body, { x: 0, y: 0 });*/
				}
				if (state == DESTROYING_STATE)
				{
					if (body.position.y - body_bounds_height > viewport_height)
					{
						fallen_shapes_amount++;
					}
				}
			}
			if (state == DESTROYING_STATE && fallen_shapes_amount == shapes.length)
			{
				stopEngine();
			}
		}

		function makeWorldBounds()
		{
			if (bounds)
			{
				for (let i = 0; i < bounds.length; i++)
				{
					Composite.remove(world, bounds[i]);
				}
			}
			let bounds_height = viewport_height * 3;

			top_bound = viewport_height - bounds_height;

			bounds = [
				Bodies.rectangle(-25, 0, 50, bounds_height, { isStatic: true }),
				Bodies.rectangle(viewport_width / 2, bounds_height - 25, viewport_width, 50, { isStatic: true }),
				Bodies.rectangle(viewport_width + 25, 0, 50, bounds_height, { isStatic: true }),
				Bodies.rectangle(viewport_width / 2, viewport_height + 25, viewport_width, 50, { isStatic: true }),
			];
			floor = bounds[bounds.length - 1];

			floor.def_y = floor.position.y;

			Composite.add(world, bounds);
		}

		function drawShapes()
		{
			canvas_ctx.fillStyle = "#000000";

			canvas_ctx.beginPath();
			canvas_ctx.clearRect(0, 0, viewport_width, viewport_height);

			canvas_ctx.moveTo(shape_01.parts[1].vertices[0].x, shape_01.parts[1].vertices[0].y);

			for (let i = 1; i < shape_01.parts[1].vertices.length; i++)
			{
				canvas_ctx.lineTo(shape_01.parts[1].vertices[i].x, shape_01.parts[1].vertices[i].y);
			}
			for (let i = 0; i < shape_01.parts[2].vertices.length; i++)
			{
				canvas_ctx.lineTo(shape_01.parts[2].vertices[i].x, shape_01.parts[2].vertices[i].y);
			}
			canvas_ctx.fill();

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(shape_02.parts[1].vertices[0].x, shape_02.parts[1].vertices[0].y);

			for (let i = 1; i < shape_02.parts[1].vertices.length; i++)
			{
				canvas_ctx.lineTo(shape_02.parts[1].vertices[i].x, shape_02.parts[1].vertices[i].y);
			}
			for (let i = 0; i < shape_02.parts[2].vertices.length; i++)
			{
				canvas_ctx.lineTo(shape_02.parts[2].vertices[i].x, shape_02.parts[2].vertices[i].y);
			}
			canvas_ctx.fill();

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(shape_03.position.x, shape_03.position.y);
			canvas_ctx.arc(shape_03.position.x, shape_03.position.y, shape_03.circleRadius, 0, Math.PI * 2);
			canvas_ctx.fill();

			let shape_04_arc_center_x = shape_04.vertices[0].x + shape_04.radius * shape_04.scale * Math.cos(shape_04.angle);
			let shape_04_arc_center_y = shape_04.vertices[0].y + shape_04.radius * shape_04.scale * Math.sin(shape_04.angle);

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(shape_04_arc_center_x, shape_04_arc_center_y);
			canvas_ctx.arc(shape_04_arc_center_x, shape_04_arc_center_y, shape_04.radius * shape_04.scale, shape_04.angle, shape_04.angle + Math.PI);
			canvas_ctx.lineTo(shape_04_arc_center_x, shape_04_arc_center_y);
			canvas_ctx.fill();

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(shape_05.vertices[0].x, shape_05.vertices[0].y);

			for (let i = 1; i < shape_05.vertices.length; i++)
			{
				canvas_ctx.lineTo(shape_05.vertices[i].x, shape_05.vertices[i].y);
			}
			canvas_ctx.lineTo(shape_05.vertices[0].x, shape_05.vertices[0].y);
			canvas_ctx.fill();

			canvas_ctx.save();
			canvas_ctx.translate(shape_06.position.x, shape_06.position.y);

			canvas_ctx.rotate(shape_06.angle);

			canvas_ctx.beginPath();
			canvas_ctx.moveTo((-shape_06.width / 2 + shape_06.chamfer_radius) * shape_06.scale, -shape_06.height / 2 * shape_06.scale);
			canvas_ctx.lineTo((-shape_06.width / 2 + shape_06.chamfer_radius + shape_06.width - shape_06.chamfer_radius * 2) * shape_06.scale, -shape_06.height / 2 * shape_06.scale);
			canvas_ctx.arc((shape_06.width / 2 - shape_06.chamfer_radius) * shape_06.scale, 0, shape_06.chamfer_radius * shape_06.scale, -Math.PI / 2, Math.PI / 2);
			canvas_ctx.lineTo((-shape_06.width / 2 + shape_06.chamfer_radius) * shape_06.scale, shape_06.height / 2 * shape_06.scale);
			canvas_ctx.arc((-shape_06.width / 2 + shape_06.chamfer_radius) * shape_06.scale, 0, shape_06.chamfer_radius * shape_06.scale, Math.PI / 2, -Math.PI / 2);
			//canvas_ctx.stroke();
			canvas_ctx.fill();
			canvas_ctx.restore();

			setupHighlightedDot(dot_01);

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(dot_01.position.x, dot_01.position.y);
			canvas_ctx.arc(dot_01.position.x, dot_01.position.y, dot_01.circleRadius, 0, Math.PI * 2);
			canvas_ctx.fill();

			setupHighlightedDot(dot_02);

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(dot_02.position.x, dot_02.position.y);
			canvas_ctx.arc(dot_02.position.x, dot_02.position.y, dot_02.circleRadius, 0, Math.PI * 2);
			canvas_ctx.fill();

			setupHighlightedDot(dot_03);

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(dot_03.position.x, dot_03.position.y);
			canvas_ctx.arc(dot_03.position.x, dot_03.position.y, dot_03.circleRadius, 0, Math.PI * 2);
			canvas_ctx.fill();

			setupHighlightedDot(dot_04);

			canvas_ctx.beginPath();
			canvas_ctx.moveTo(dot_04.position.x, dot_04.position.y);
			canvas_ctx.arc(dot_04.position.x, dot_04.position.y, dot_04.circleRadius, 0, Math.PI * 2);
			canvas_ctx.fill();
		}

		function setupHighlightedDot(dot)
		{
			let gradient;

			if (!dot.highlighted)
			{
				canvas_ctx.fillStyle = "#FFFFFF" ;
			}
			else
			{
				gradient = canvas_ctx.createRadialGradient(dot.position.x, dot.position.y, 0, dot.position.x, dot.position.y - dot.circleRadius, dot.circleRadius * 2);

				gradient.addColorStop(0, "#FFFFFF");
				gradient.addColorStop(0.25, "#FFFFFF");
				gradient.addColorStop(1, "#6855ec")

				canvas_ctx.fillStyle = gradient;
			}
		}

		function arrangeShapesOnGrid(rows = 3, columns = 4)
		{
			let start_x = 0;
			let start_y = top_bound;
			let x = start_x;
			let y = start_y;
			let column_gap = 10;
			let row_gap = 3;
			let last_body;
			let i = 0;

			for (let row = 0; row < rows; row++)
			{
				let max_height = 0;

				for (let column = 0; column < columns; column++)
				{
					let body = shapes[row * columns + column];

					if (body)
					{
						Body.setPosition(body, {x: x, y: y});
						//Body.setAngle(body, 0);
						//Body.setVelocity(body, { x: 0, y: 0 });
						//Body.setAngularVelocity(body, { x: 0, y: 0 });

						let body_height = body.bounds.max.y - body.bounds.min.y;
						let body_width = body.bounds.max.x - body.bounds.min.x;

						if (body_height > max_height)
						{
							max_height = body_height;
						}
						Body.translate(body, {x: body_width * 0.5, y: body_height * 0.5});

						x = body.bounds.max.x + column_gap;

						last_body = body;
					}
					i++;
				}
				y += max_height + row_gap;
				x = start_x;
			}
		}

		function updateLayout(event)
		{
			viewport_width = app_cont.clientWidth;
			viewport_height = app_cont.clientHeight;

			scaleShapes();
			makeWorldBounds();

			canvas.width = viewport_width;
			canvas.height = viewport_height;

			/*render.bounds.max.x = viewport_width;
			render.bounds.max.y = viewport_height;
			render.options.width = viewport_width;
			render.options.height = viewport_height;
			render.canvas.width = viewport_width;
			render.canvas.height = viewport_height;

			Render.lookAt(render, {
				min: { x: 0, y: 0 },
				max: { x: viewport_width, y: viewport_height }
			});*/
		}

		function scaleShapes()
		{
			let cur_scale = viewport_width_breakpoint ? viewport_width_breakpoint[1] : 1;
			let new_viewport_width_breakpoint;

			for (let i = 0; i < SHAPES_SCALING.length; i++)
			{
				if (viewport_width > SHAPES_SCALING[i][0])
				{
					new_viewport_width_breakpoint = SHAPES_SCALING[i];
				}
			}
			let initial_scaling = !viewport_width_breakpoint;

			if (new_viewport_width_breakpoint != viewport_width_breakpoint)
			{
				viewport_width_breakpoint = new_viewport_width_breakpoint;

				let scale_diff_coef = viewport_width_breakpoint[1] / cur_scale;

				shapes.forEach((shape) =>
				{
					shape.scale = viewport_width_breakpoint[1];

					Body.scale(shape, scale_diff_coef, scale_diff_coef);

					if (!initial_scaling)
					{
						Body.setPosition(shape, { x: shape.position.x * scale_diff_coef, y: shape.position.y });
					}
				});
			}
		}

		function reload(event)
		{
			state = DEFAULT_STATE;

			floor.isSensor = false;

			Body.setPosition(floor, { x: floor.position.x, y: floor.def_y });

			arrangeShapesOnGrid();

			Matter.Events.on(engine, "afterUpdate", restrictShapesPosition);

			Runner.run(runner, engine);

			reload_button.disabled = true;
			destroy_button.disabled = false;
		}

		function destroy(event)
		{
			state = DESTROYING_STATE;

			floor.isSensor = true;

			Body.setPosition(floor, { x: floor.position.x, y: 10000 });

			for (let i = 0; i < shapes.length; i++)
			{
				shapes[i].isStatic = false;
			}
			reload_button.disabled = true;
			destroy_button.disabled = true;
		}

		function stopEngine()
		{
			Runner.stop(runner);

			Matter.Events.off(engine, "afterUpdate", restrictShapesPosition);

			for (let i = 0; i < shapes.length; i++)
			{
				Body.setVelocity(shapes[i], { x: 0, y: 0 });
				Body.setAngularVelocity(shapes[i], 0);
			}
			reload_button.disabled = false;
		}

	}

}
new App();