(function($) {
	$.fn.numberSpinner = function(options) {
		var spinTimer;
		var loop = false;
		var loopDelay;

		var constants = {
			up               : 0,
			down             : 1
		}
		var settings = $.extend({
			startValue       : 0,
			stepSize         : 1,
			min              : null,
			max              : null,
			intervalStart    : 500,
			intervalEnd      : 10,
			decimalSign      : ',',
			upContent        : '\u25b2',
			downContent      : '\u25bc'
		}, options);
		
		var methods = {

			getValueOrDefault: function(eInput){
				return ($(eInput).val()).length > 0 ? parseFloat(($(eInput).val().replace(settings.decimalSign,'.'))) : parseFloat(settings.startValue);
			},
			
			setValue: function(eInput, value){
				value = value.toFixed(methods.getDecimalsStepSize(eInput)).toString().replace('.', settings.decimalSign)
				$(eInput).val(value);
			},
			
			getDecimalsStepSize : function (eInput){
				var decimalsInput = (methods.getValueOrDefault(eInput)).toString();
				var decimalsStepSize = (settings.stepSize).toString();
				var decimals = 0;
				if (decimalsInput.indexOf('.')> -1){
					decimals = decimalsInput.length - (decimalsInput.indexOf('.') + 1);
				} 
				if (decimalsStepSize.indexOf('.')> -1){
					if (decimalsStepSize.length - (decimalsStepSize.indexOf('.') + 1) > decimals)
						decimals = decimalsStepSize.length - (decimalsStepSize.indexOf('.') + 1);
				}
				return decimals;
			},
			
			mouseDown: function(eInput, direction){
				loop = true;
				loopDelay = settings.intervalStart;
				methods.renewLoop(eInput, direction, true);
			},
			
			mouseUp: function(){
				methods.clearLoop();
			},
			
			mouseLeave: function(){
				methods.clearLoop();
			},
			
			renewLoop: function(eInput, direction, first){
				if (first){
					if (loop){
						spinTimer = setTimeout(function(){
							methods.spin(eInput, direction);
						},1);
					
						methods.changeLoopDelay();
						click = false;
					}
				} else {
					if (loop){
						spinTimer = setTimeout(function(){
							methods.spin(eInput, direction);
						},loopDelay);
					
						methods.changeLoopDelay();
						click = false;
					}
				}
			},
			
			changeLoopDelay: function(){
				var changeDelay = (settings.intervalStart - settings.intervalEnd)/20;
				if (loopDelay-changeDelay > settings.intervalEnd){
					loopDelay -= changeDelay;
				} else {
					loopDelay = settings.intervalEnd;
				}
			},
			
			clearLoop: function(){
				loop = false;
				clearTimeout(spinTimer);
				click = true;
			},
			
			spin: function(eInput, direction){
				var value = methods.getValueOrDefault(eInput);
				switch (direction){
					case constants.down:{
						if (settings.min == null ) {
							value -= settings.stepSize;
						} else if ((value - settings.stepSize) >= settings.min){
							value -= settings.stepSize;
						} else {
							value = settings.min;
						}
						methods.setValue(eInput, value);
						break;
					}
					case constants.up:{
						if (settings.max == null) {
							value += settings.stepSize;
						} else if ((value + settings.stepSize) <= settings.max){
							value += settings.stepSize;
						} else {
							value = settings.max;
						}
						methods.setValue(eInput, value);
						break;
					}
				}
				methods.renewLoop(eInput, direction, false);
			},
			
			adddButtonsToInput: function(eInput){
				$(eInput).after(
					'<div class="simpleSpinner-buttons">' +
					'<button class="simpleSpinner-up" type="button">'+ settings.upContent +'</button>' + 
					'<button class="simpleSpinner-down" type="button">'+ settings.downContent +'</button>' +
					'</div>'
					);
				var buttons = $(eInput).next().children();
				var buttonUp = buttons[0];
				var buttonDown = buttons[1];
				
				$(buttonUp).unbind();
				$(buttonDown).unbind();

				$(buttonDown).mousedown(function(){
					methods.mouseDown(eInput, constants.down);
				});
				$(buttonDown).mouseup(function(){
					methods.mouseUp();
				});
				$(buttonDown).mouseleave(function(){
					methods.mouseLeave();
				});

				$(buttonUp).mousedown(function(){
					methods.mouseDown(eInput, constants.up);
				});
				$(buttonUp).mouseup(function(){
					methods.mouseUp();
				});
				$(buttonUp).mouseleave(function(){
					methods.mouseLeave();
				});
			}
		};

		return this.each(function() {
			// set defaultvalue in input if empty
			$(this).val(methods.getValueOrDefault(this));
			//add div and buttons after input
			methods.adddButtonsToInput(this);
		});
		
	};
})(jQuery);