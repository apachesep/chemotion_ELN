class Report::SdfExport
  def initialize
    @@sample_list = Array.new
  end

  def add_sample(sample)
    @@sample_list << sample
  end

  def generate_file(default_excluded_field, default_included_field, removed_field = [])
    return -1 if @@sample_list.empty? || @@sample_list.first == nil

    mdf_string = ""
    # We dont want to export Sample description
    default_excluded_field << ["description", "image"]
    default_included_field = default_included_field.map! {|x|
      x.slice!("molecule.")
      x
    }
    included_field = @@sample_list.first.attribute_names
    # Exclude field
    included_field.delete_if { |x| default_excluded_field.include?(x) }
    included_field = included_field.reject { |x| x.empty? }
    included_field = included_field.uniq - removed_field

    @@sample_list.compact.each_with_index do |sample, index|
      sample_mdf = sample.molfile.split(/#|END/).first + "END\n"

      default_included_field.each do |field|
        value = sample.molecule.send(field) || ""
        next if value.empty?

        value = validate_value(value)

        field_str = field.gsub(" ", "_").upcase

        field_mdf = ">  <#{field_str}> (#{sample.id})\n#{value}\n\n"

        sample_mdf = sample_mdf + field_mdf
      end
      included_field.each do |field|
        value = sample.send(field) || ""
        next if value.empty?

        value = validate_value(value)

        field_str = field.gsub(" ", "_").upcase

        field_mdf = ">  <#{field_str}> (#{sample.id})\n#{value}\n\n"

        sample_mdf = sample_mdf + field_mdf
      end

      mdf_string = mdf_string + sample_mdf + "$$$$\n"
    end

    mdf_string
  end

  def validate_value value
    if [">", "$", "<"].include?(value.first)
      value.slice!(0)
      return validate_value(value)
    end

    return value
  end
end